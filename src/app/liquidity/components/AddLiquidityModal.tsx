'use client'

import { useState, useEffect, useCallback } from 'react'
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import TokenSelectorModal from '../../../components/TokenSelectorModal'
import DirectionSlider from './DirectionSlider'
import { useLiquidity } from '../hooks/useLiquidity'
import { useLiquidityActions } from '../hooks/useLiquidityActions'
import { useScrollLock } from '../hooks/useScrollLock'
import toast from 'react-hot-toast'
import { type Token } from '../../../components/TokenSelectorModal'
import TransactionLoadingOverlay from '../../../components/ui/TransactionLoadingOverlay'
import { ethers } from 'ethers'
import { useStore } from '../../../store/useStore'
import { getMarketAddress } from '../../../lib/sdk-utils'
import { MARKET_ABI } from '../../../lib/abis'

interface LiquidityPosition {
  id: number
  pair: string
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
  liquidity: string
  value: string
  apr: string
  fees24h: string
  pnl: string
  pnlPercent: string
  isProfit: boolean
  reserve0Long: string
  reserve0Short: string
  reserve1Long: string
  reserve1Short: string
  totalShares: string
  myShares: string
  sharePercent: string
}

interface AddLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPosition?: LiquidityPosition | null
  onTransactionComplete?: () => Promise<void>
}

export default function AddLiquidityModal({ isOpen, onClose, selectedPosition, onTransactionComplete }: AddLiquidityModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTokenA, setSelectedTokenA] = useState<Token | null>(null)
  const [selectedTokenB, setSelectedTokenB] = useState<Token | null>(null)
  const [amountA, setAmountA] = useState<string>('')
  const [amountB, setAmountB] = useState<string>('')
  const [bullishPercentage, setBullishPercentage] = useState(50)
  const [bearishPercentage, setBearishPercentage] = useState(50)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState<{ tokenAToB: number; tokenBToA: number } | null>(null)
  const [poolReserves, setPoolReserves] = useState<{ reserve0: bigint; reserve1: bigint } | null>(null)
  const [isLoadingPoolData, setIsLoadingPoolData] = useState(false)
  const [showTokenSelectorA, setShowTokenSelectorA] = useState(false)
  const [showTokenSelectorB, setShowTokenSelectorB] = useState(false)

  const { isAuthenticated } = useLiquidity()
  const { performAddLiquidity } = useLiquidityActions()
  
  // Pool key for identification (still useful for debugging)
  const poolKey = selectedTokenA && selectedTokenB ? `${selectedTokenA.symbol}-${selectedTokenB.symbol}` : ''
  
  // Calculate pool price from actual reserves (price = totalReserve1 / totalReserve0)
  const poolPrice = poolReserves && selectedTokenA && selectedTokenB 
    ? Number(ethers.formatUnits(poolReserves.reserve1, selectedTokenB.decimals)) / 
      Number(ethers.formatUnits(poolReserves.reserve0, selectedTokenA.decimals))
    : 0
  
  // Lock background scroll when modal is open
  useScrollLock(isOpen)

  // Token sorting and validation functions
  const sortTokens = (tokenA: Token, tokenB: Token): [Token, Token] => {
    // Sort tokens by address (lexicographic order)
    return tokenA.address.toLowerCase() < tokenB.address.toLowerCase() 
      ? [tokenA, tokenB] 
      : [tokenB, tokenA]
  }

  const handleTokenASelection = (token: Token | null) => {
    if (!token) {
      setSelectedTokenA(null)
      setShowTokenSelectorA(false)
      return
    }

    // Check if same as TokenB
    if (selectedTokenB && token.address === selectedTokenB.address) {
      toast.error('Cannot select the same token for both positions')
      setShowTokenSelectorA(false)
      return
    }

    setSelectedTokenA(token)
    setShowTokenSelectorA(false)
    
    // If both tokens are selected, sort them
    if (selectedTokenB) {
      const [token0, token1] = sortTokens(token, selectedTokenB)
      if (token0.address !== token.address) {
        // Need to swap: current selection becomes TokenB
        setSelectedTokenA(token1)
        setSelectedTokenB(token0)
        // Also swap amounts if they exist
        if (amountA || amountB) {
          const tempAmount = amountA
          setAmountA(amountB)
          setAmountB(tempAmount)
        }
      }
    }
  }

  const handleTokenBSelection = (token: Token | null) => {
    if (!token) {
      setSelectedTokenB(null)
      setShowTokenSelectorB(false)
      return
    }

    // Check if same as TokenA
    if (selectedTokenA && token.address === selectedTokenA.address) {
      toast.error('Cannot select the same token for both positions')
      setShowTokenSelectorB(false)
      return
    }

    setSelectedTokenB(token)
    setShowTokenSelectorB(false)
    
    // If both tokens are selected, sort them
    if (selectedTokenA) {
      const [token0, token1] = sortTokens(selectedTokenA, token)
      if (token0.address !== selectedTokenA.address) {
        // Need to swap: TokenA becomes TokenB and vice versa
        setSelectedTokenA(token0)
        setSelectedTokenB(token1)
        // Also swap amounts if they exist
        if (amountA || amountB) {
          const tempAmount = amountA
          setAmountA(amountB)
          setAmountB(tempAmount)
        }
      }
    }
  }

  // Calculate decimal-aware price for new pools
  const calculateDecimalAwarePrice = () => {
    if (!selectedTokenA || !selectedTokenB || !amountA || !amountB) {
      setCalculatedPrice(null)
      return
    }

    try {
      const amountANum = Number(amountA)
      const amountBNum = Number(amountB)
      
      if (amountANum <= 0 || amountBNum <= 0) {
        setCalculatedPrice(null)
        return
      }

      // Normalize amounts using token decimals
      const amountABase = amountANum * Math.pow(10, selectedTokenA.decimals)
      const amountBBase = amountBNum * Math.pow(10, selectedTokenB.decimals)
      
      // Calculate exchange rates (decimal-adjusted)
      const tokenAToB = amountBBase / amountABase
      const tokenBToA = amountABase / amountBBase
      
      setCalculatedPrice({ tokenAToB, tokenBToA })
    } catch (error) {
      console.error('Error calculating decimal-aware price:', error)
      setCalculatedPrice(null)
    }
  }

  // Direct pool detection using getReserves() - simplified approach
  const checkPoolExistence = async () => {
    if (!selectedTokenA || !selectedTokenB) {
      setPoolReserves(null)
      setIsLoadingPoolData(false)
      return
    }

    setIsLoadingPoolData(true)
    console.log('🔍 Checking pool existence for:', selectedTokenA.symbol, selectedTokenB.symbol)
    
    try {
      const { provider, isConnected } = useStore.getState()
      
      if (!isConnected || !provider) {
        console.log('❌ Wallet not connected')
        setIsLoadingPoolData(false)
        return
      }

      const marketAddress = getMarketAddress(57054)
      const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider)
      
      // Sort tokens to ensure proper order
      const [token0, token1] = sortTokens(selectedTokenA, selectedTokenB)
      
      console.log('📞 Calling getReserves() for:', token0.symbol, token1.symbol)
      const reserves = await marketContract.getReserves(token0.address, token1.address)
      
      const [reserve0Long, reserve0Short, reserve1Long, reserve1Short] = reserves
      
      console.log('📊 Reserves received:', {
        reserve0Long: reserve0Long.toString(),
        reserve0Short: reserve0Short.toString(), 
        reserve1Long: reserve1Long.toString(),
        reserve1Short: reserve1Short.toString()
      })
      
      // Pool exists if reserve0Long > 0
      const poolExists = reserve0Long > 0n
      console.log('✅ Pool exists:', poolExists)
      
      if (poolExists) {
        // Calculate total reserves: totalReserveX = reserve0Long + reserve0Short
        const totalReserve0 = reserve0Long + reserve0Short
        const totalReserve1 = reserve1Long + reserve1Short
        
        setPoolReserves({
          reserve0: totalReserve0,
          reserve1: totalReserve1
        })
        
        console.log('💰 Total reserves:', {
          token0: totalReserve0.toString(),
          token1: totalReserve1.toString()
        })
      } else {
        setPoolReserves(null)
        console.log('🆕 New pool - no reserves')
      }
    } catch (error) {
      console.error('❌ Pool detection failed:', error)
      setPoolReserves(null)
    } finally {
      setIsLoadingPoolData(false)
    }
  }

  // Calculate decimal-aware price when tokens and amounts change
  useEffect(() => {
    if (selectedTokenA && selectedTokenB && amountA && amountB && Number(amountA) > 0 && Number(amountB) > 0) {
      calculateDecimalAwarePrice()
    } else {
      setCalculatedPrice(null)
    }
  }, [selectedTokenA, selectedTokenB, amountA, amountB])

  // Check pool existence when tokens change
  useEffect(() => {
    if (selectedTokenA && selectedTokenB) {
      checkPoolExistence()
    } else {
      setPoolReserves(null)
      setIsLoadingPoolData(false)
    }
  }, [selectedTokenA, selectedTokenB])

  // Handle liquidity submission
  const handleLiquiditySubmission = async () => {
    if (!isAuthenticated) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!selectedTokenA || !selectedTokenB || !amountA || !amountB) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Calculate directional amounts based on mirrored percentages (same logic as step 3 display)
      const totalAmountA = parseFloat(amountA)
      const totalAmountB = parseFloat(amountB)
      const sliderValue = bullishPercentage // Current slider position
      
      // Mirrored allocation logic: Token A and Token B have opposite allocations
      // When slider is at 80%, it means 80% bullish on Token A, 20% bullish on Token B
      const tokenABullishRatio = sliderValue / 100 // Token A bullish percentage
      const tokenABearishRatio = (100 - sliderValue) / 100 // Token A bearish percentage
      const tokenBBullishRatio = (100 - sliderValue) / 100 // Token B bullish percentage (mirrored)
      const tokenBBearishRatio = sliderValue / 100 // Token B bearish percentage (mirrored)
      
      // For token A (first token)
      const amount0Long = (totalAmountA * tokenABullishRatio).toString()
      const amount0Short = (totalAmountA * tokenABearishRatio).toString()
      
      // For token B (second token) - mirrored allocation
      const amount1Long = (totalAmountB * tokenBBullishRatio).toString()
      const amount1Short = (totalAmountB * tokenBBearishRatio).toString()

      // Use actual token addresses from selected tokens
      const token0Address = selectedTokenA.address
      const token1Address = selectedTokenB.address

      // Use the reusable performAddLiquidity function that handles refresh automatically
      await performAddLiquidity(
        {
          token0Address,
          token1Address,
          amount0Long,
          amount0Short,
          amount1Long,
          amount1Short,
          token0Decimals: selectedTokenA.decimals,
          token1Decimals: selectedTokenB.decimals
        },
        async () => {
          // Close modal and refresh main page positions
          handleClose()
          if (onTransactionComplete) {
            await onTransactionComplete()
          }
        }
      )
    } catch (error) {
      console.error('Error adding liquidity:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add liquidity')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-select tokens when selectedPosition is provided
  useEffect(() => {
    if (selectedPosition && isOpen) {
      // Create Token objects directly from position data
      const token0: Token = {
        address: selectedPosition.token0Address,
        symbol: selectedPosition.token0Symbol,
        name: selectedPosition.token0Symbol, // Use symbol as name for now
        decimals: 18, // Default to 18, could be improved by fetching actual decimals
        chainId: 57054, // Sonic Blaze testnet
        logoURI: '' // No logo for now
      }
      
      const token1: Token = {
        address: selectedPosition.token1Address,
        symbol: selectedPosition.token1Symbol,
        name: selectedPosition.token1Symbol, // Use symbol as name for now
        decimals: 18, // Default to 18, could be improved by fetching actual decimals
        chainId: 57054, // Sonic Blaze testnet
        logoURI: '' // No logo for now
      }
      
      // Sort tokens to ensure proper order (token0 < token1)
      const [sortedToken0, sortedToken1] = sortTokens(token0, token1)
      setSelectedTokenA(sortedToken0)
      setSelectedTokenB(sortedToken1)
      
      console.log('Pre-selected tokens from position:', {
        token0: sortedToken0,
        token1: sortedToken1
      })
    }
  }, [selectedPosition, isOpen])

  // Token fetching is now handled by TokenSelectorModal

  if (!isOpen) return null



  const canProceedToStep2 = selectedTokenA && selectedTokenB && selectedTokenA.address !== selectedTokenB.address
  const canProceedToStep3 = canProceedToStep2 && amountA && amountB && Number(amountA) > 0 && Number(amountB) > 0
  const canComplete = canProceedToStep3 && (bullishPercentage + bearishPercentage === 100)

  const handleClose = () => {
    onClose()
    // Reset form state when closing
    setCurrentStep(1)
    setSelectedTokenA(null)
    setSelectedTokenB(null)
    setAmountA('')
    setAmountB('')
    setBullishPercentage(50)
    setBearishPercentage(50)
    setCalculatedPrice(null)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select Token Pair</h2>
        <p className="text-gray-400">Choose the tokens you want to provide liquidity for</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">First Token</label>
          <button
            onClick={() => setShowTokenSelectorA(true)}
            className="w-full flex items-center justify-between p-3 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {selectedTokenA ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {selectedTokenA.symbol.charAt(0)}
                  </div>
                  <span className="text-white">{selectedTokenA.symbol}</span>
                </>
              ) : (
                <span className="text-gray-400">Select first token</span>
              )}
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Second Token</label>
          <button
            onClick={() => setShowTokenSelectorB(true)}
            className="w-full flex items-center justify-between p-3 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {selectedTokenB ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {selectedTokenB.symbol.charAt(0)}
                  </div>
                  <span className="text-white">{selectedTokenB.symbol}</span>
                </>
              ) : (
                <span className="text-gray-400">Select second token</span>
              )}
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {poolKey && (
          <div className="bg-gray-800 dark:bg-gray-700 rounded-lg p-4 border border-gray-700 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              {isLoadingPoolData ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-400">Checking Pool...</span>
                </>
              ) : poolReserves ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-400">Pool Exists</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-yellow-400">New Pool</span>
                </>
              )}
            </div>
            {poolReserves && !isLoadingPoolData && (
              <div className="mt-2 text-sm text-gray-400">
                Pool has reserves - ratio will be enforced
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Set Token Amounts</h2>
        <p className="text-gray-400">
          {poolReserves ? 'Enter amounts (ratio will be enforced)' : 'Set initial pool ratio'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {selectedTokenA?.symbol || 'Token A'} Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amountA}
              onChange={(e) => {
                setAmountA(e.target.value)
                // Enforce ratio for existing pools using actual reserves
                if (poolReserves && e.target.value && Number(e.target.value) > 0) {
                  console.log('Pool reserves found, calculating ratio...', poolReserves)
                  const [token0, token1] = sortTokens(selectedTokenA!, selectedTokenB!)
                  const isTokenAFirst = selectedTokenA!.address.toLowerCase() === token0.address.toLowerCase()
                  
                  console.log('Token order:', { token0: token0.symbol, token1: token1.symbol, isTokenAFirst })
                  
                  // Calculate ratio based on actual reserves
                  const reserve0Formatted = Number(ethers.formatUnits(poolReserves.reserve0, token0.decimals))
                  const reserve1Formatted = Number(ethers.formatUnits(poolReserves.reserve1, token1.decimals))
                  
                  console.log('Formatted reserves:', { reserve0Formatted, reserve1Formatted })
                  
                  const ratio = isTokenAFirst 
                    ? reserve1Formatted / reserve0Formatted
                    : reserve0Formatted / reserve1Formatted
                  
                  console.log('Calculated ratio:', ratio)
                  
                  const calculatedAmountB = Number(e.target.value) * ratio
                  console.log('Calculated amount B:', calculatedAmountB)
                  setAmountB(calculatedAmountB.toString())
                } else {
                  console.log('Ratio enforcement not triggered:', { poolReserves: !!poolReserves, value: e.target.value })
                }
              }}
              placeholder="0.0"
              className="w-full p-4 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {selectedTokenA?.symbol || 'Token A'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {selectedTokenB?.symbol || 'Token B'} Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amountB}
              onChange={(e) => {
                setAmountB(e.target.value)
                // Enforce ratio for existing pools using actual reserves
                if (poolReserves && e.target.value && Number(e.target.value) > 0) {
                  const [token0, token1] = sortTokens(selectedTokenA!, selectedTokenB!)
                  const isTokenAFirst = selectedTokenA!.address.toLowerCase() === token0.address.toLowerCase()
                  
                  // Calculate ratio based on actual reserves
                  const ratio = isTokenAFirst 
                    ? Number(ethers.formatUnits(poolReserves.reserve0, selectedTokenA!.decimals)) / Number(ethers.formatUnits(poolReserves.reserve1, selectedTokenB!.decimals))
                    : Number(ethers.formatUnits(poolReserves.reserve1, selectedTokenB!.decimals)) / Number(ethers.formatUnits(poolReserves.reserve0, selectedTokenA!.decimals))
                  
                  const calculatedAmountA = Number(e.target.value) * ratio
                  setAmountA(calculatedAmountA.toString())
                }
              }}
              placeholder="0.0"
              className="w-full p-4 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {selectedTokenB?.symbol || 'Token B'}
            </div>
          </div>
        </div>
      </div>

      {poolReserves && selectedTokenA && selectedTokenB && amountA && amountB && (
        <div className="bg-gray-800 dark:bg-gray-700 rounded-lg p-4 border border-gray-700 dark:border-gray-600">
          <div className="text-sm text-gray-300 mb-2">Pool Price Impact</div>
          <div className="text-green-400 text-sm">
            Current ratio maintained: 1 {selectedTokenA.symbol} = {poolPrice.toLocaleString()} {selectedTokenB.symbol}
          </div>
        </div>
      )}

      {/* Only show Initial Pool Price widget for NEW pools */}
      {!poolReserves && !isLoadingPoolData && selectedTokenA && selectedTokenB && calculatedPrice && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-sm text-blue-300 mb-2">Initial Pool Price (Decimal-Adjusted)</div>
          <div className="space-y-2">
            <div className="text-blue-400 text-sm">
              1 {selectedTokenA.symbol} = {calculatedPrice.tokenAToB.toLocaleString(undefined, { maximumFractionDigits: 8 })} {selectedTokenB.symbol}
            </div>
            <div className="text-blue-400 text-sm">
              1 {selectedTokenB.symbol} = {calculatedPrice.tokenBToA.toLocaleString(undefined, { maximumFractionDigits: 8 })} {selectedTokenA.symbol}
            </div>
          </div>
          <div className="text-xs text-blue-300/70 mt-2">
            This exchange rate accounts for token decimals ({selectedTokenA.symbol}: {selectedTokenA.decimals}, {selectedTokenB.symbol}: {selectedTokenB.decimals})
          </div>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => {
    // Calculate proportional amounts based on slider position (0-100)
    // 0 = 100% TokenA Bullish/TokenB Bearish, 100 = 100% TokenB Bullish/TokenA Bearish
    const sliderValue = bullishPercentage // Reuse existing state
    
    // Calculate directional amounts
    const totalAmountA = Number(amountA) || 0
    const totalAmountB = Number(amountB) || 0
    
    // Calculate directional amounts based on slider position (mirrored)
    // When slider is at 80%, it means 80% bullish on Token A
    const tokenABullishRatio = sliderValue / 100 // Token A bullish percentage
    const tokenABearishRatio = (100 - sliderValue) / 100 // Token A bearish percentage
    const tokenBBullishRatio = (100 - sliderValue) / 100 // Token B bullish percentage (mirrored)
    const tokenBBearishRatio = sliderValue / 100 // Token B bearish percentage (mirrored)
    
    const amountALong = totalAmountA * tokenABullishRatio
    const amountAShort = totalAmountA * tokenABearishRatio
    const amountBLong = totalAmountB * tokenBBullishRatio
    const amountBShort = totalAmountB * tokenBBearishRatio

    // TODO: Calculate actual LP tokens using quoteLiquidity from Router
    // For now, use placeholder calculations
    const estimatedLongLP = (amountALong + amountBLong) * 0.1
    const estimatedShortLP = (amountAShort + amountBShort) * 0.1

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Set Position Allocation</h2>
          <p className="text-gray-400">Choose your directional bias for this liquidity position</p>
        </div>

        {/* Single Slider */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className="text-gray-400">0% {selectedTokenA?.symbol} Bullish</span>
            <span className="text-gray-400">100% {selectedTokenA?.symbol} Bullish</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => {
                const value = Number(e.target.value)
                setBullishPercentage(value)
                setBearishPercentage(100 - value)
              }}
              className="w-full h-3 bg-gradient-to-r from-green-500 to-red-500 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-300">
            Current: {sliderValue.toFixed(0)}% {selectedTokenA?.symbol} Bullish / {(100 - sliderValue).toFixed(0)}% {selectedTokenB?.symbol} Bullish
          </div>
        </div>

        {/* Token Amount Breakdown */}
        <div className="bg-gray-800 dark:bg-gray-700 rounded-lg p-4 border border-gray-700 dark:border-gray-600">
          <div className="text-sm text-gray-300 mb-3">Token Allocation Breakdown</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-gray-400">{selectedTokenA?.symbol} Distribution</div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Long:</span>
                <span className="text-green-400 font-mono">{amountALong.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Short:</span>
                <span className="text-red-400 font-mono">{amountAShort.toFixed(4)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-400">{selectedTokenB?.symbol} Distribution</div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Long:</span>
                <span className="text-green-400 font-mono">{amountBLong.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Short:</span>
                <span className="text-red-400 font-mono">{amountBShort.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-400 text-sm">
            <strong>Position Explanation:</strong> Moving the slider left favors {selectedTokenA?.symbol} bullish positions, 
            while moving right favors {selectedTokenB?.symbol} bullish positions. Your liquidity will be allocated 
            proportionally across long and short positions for both tokens.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md md:max-w-xl max-h-[calc(100vh-4rem)] overflow-y-auto relative">
        {/* Loading Overlay */}
        <TransactionLoadingOverlay 
          isVisible={isSubmitting}
          title="Adding Liquidity..."
          subtitle="Please confirm the transaction in your wallet"
        />
        <div className="p-6 pb-24 md:pb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Add Liquidity</h2>
            <button
              onClick={handleClose}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep
                      ? 'bg-blue-500 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              hidden={currentStep === 1}
              className="w-full justify-center flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                if (currentStep === 3) {
                  handleLiquiditySubmission()
                } else {
                  setCurrentStep(currentStep + 1)
                }
              }}
              disabled={
                (currentStep === 1 && !canProceedToStep2) ||
                (currentStep === 2 && !canProceedToStep3) ||
                (currentStep === 3 && (!canComplete || isSubmitting))
              }
              className="w-full justify-center flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>
                {currentStep === 3 
                  ? (isSubmitting ? 'Adding Liquidity...' : 'Provide Liquidity') 
                  : 'Continue'
                }
              </span>
              {currentStep < 3 && <ArrowRightIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Token Selector Modals */}
      <TokenSelectorModal
        isOpen={showTokenSelectorA}
        onClose={() => setShowTokenSelectorA(false)}
        onTokenSelect={handleTokenASelection}
        title="Select first token"
        excludeToken={selectedTokenB}
      />
      
      <TokenSelectorModal
        isOpen={showTokenSelectorB}
        onClose={() => setShowTokenSelectorB(false)}
        onTokenSelect={handleTokenBSelection}
        title="Select second token"
        excludeToken={selectedTokenA}
      />
    </div>
  )
}

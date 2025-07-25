'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowsUpDownIcon,
  CogIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useStore } from '@/store/useStore'
import { 
  Token, 
  PennysiaAMM, 
  PENNYSIA_CONSTANTS,
  calculateMinimumAmount,
  parseContractError,
  formatTokenAmount,
  parseTokenAmount
} from '@/lib/index'
import { toast } from 'react-hot-toast'
import clsx from 'clsx'

interface SwapInterfaceProps {
  className?: string
}

export default function SwapInterface({ className }: SwapInterfaceProps) {
  const {
    isConnected,
    address,
    sdk,
    selectedTokenA,
    selectedTokenB,
    isLongPosition,
    setPositionType,
    setError
  } = useStore()

  // Local state
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [priceImpact, setPriceImpact] = useState('')
  const [slippage, setSlippage] = useState(PENNYSIA_CONSTANTS.DEFAULT_SLIPPAGE_BPS / 100) // 0.5%
  const [showSettings, setShowSettings] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  // Calculate output amount when input changes
  useEffect(() => {
    if (!inputAmount || !selectedTokenA || !selectedTokenB || !sdk) {
      setOutputAmount('')
      setPriceImpact('')
      return
    }

    const calculateOutput = async () => {
      try {
        setIsCalculating(true)
        
        // Parse input amount to wei
        const inputAmountWei = parseTokenAmount(inputAmount, selectedTokenA.decimals)
        
        // Mock reserves for demonstration (in production, fetch from contract)
        const mockReserves = {
          reserve0Long: '1000000000000000000000', // 1000 tokens
          reserve0Short: '500000000000000000000',  // 500 tokens
          reserve1Long: '2000000000000000000000', // 2000 tokens
          reserve1Short: '1000000000000000000000'  // 1000 tokens
        }

        // Determine which reserves to use based on position type and token
        const isToken0Input = selectedTokenA.address.toLowerCase() < selectedTokenB.address.toLowerCase()
        
        let reserveIn: string, reserveOut: string
        if (isToken0Input) {
          reserveIn = isLongPosition ? mockReserves.reserve0Long : mockReserves.reserve0Short
          reserveOut = isLongPosition ? mockReserves.reserve1Long : mockReserves.reserve1Short
        } else {
          reserveIn = isLongPosition ? mockReserves.reserve1Long : mockReserves.reserve1Short
          reserveOut = isLongPosition ? mockReserves.reserve0Long : mockReserves.reserve0Short
        }

        // Calculate output using AMM math
        const outputAmountWei = PennysiaAMM.getAmountOut(inputAmountWei, reserveIn, reserveOut)
        const calculatedPriceImpact = PennysiaAMM.getPriceImpact(inputAmountWei, reserveIn, reserveOut)
        
        // Format output amount
        const formattedOutput = formatTokenAmount(outputAmountWei, selectedTokenB.decimals)
        
        setOutputAmount(formattedOutput)
        setPriceImpact(calculatedPriceImpact)
        
      } catch (error: any) {
        console.error('Error calculating output:', error)
        setOutputAmount('')
        setPriceImpact('')
      } finally {
        setIsCalculating(false)
      }
    }

    const timeoutId = setTimeout(calculateOutput, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [inputAmount, selectedTokenA, selectedTokenB, isLongPosition, sdk])

  const handleSwap = async () => {
    if (!isConnected || !sdk || !selectedTokenA || !selectedTokenB || !inputAmount || !outputAmount) {
      toast.error('Please connect wallet and enter amounts')
      return
    }

    try {
      setIsSwapping(true)
      
      // Calculate minimum output with slippage
      const outputAmountWei = parseTokenAmount(outputAmount, selectedTokenB.decimals)
      const minOutputAmount = calculateMinimumAmount(outputAmountWei, slippage * 100) // Convert to basis points
      
      // Create swap parameters
      const swapParams = {
        path: [selectedTokenA.address, selectedTokenB.address],
        amountIn: parseTokenAmount(inputAmount, selectedTokenA.decimals),
        amountOutMin: minOutputAmount,
        to: address || '',
        deadline: Math.floor(Date.now() / 1000) + PENNYSIA_CONSTANTS.DEFAULT_DEADLINE_SECONDS
      }

      // Execute swap (mock for now - would call actual contract)
      console.log('Swap parameters:', swapParams)
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Swapped ${inputAmount} ${selectedTokenA.symbol} for ${outputAmount} ${selectedTokenB.symbol}`)
      
      // Reset form
      setInputAmount('')
      setOutputAmount('')
      setPriceImpact('')
      
    } catch (error: any) {
      const parsedError = parseContractError(error)
      toast.error(parsedError.message)
      setError(parsedError.message)
    } finally {
      setIsSwapping(false)
    }
  }

  const handleFlipTokens = () => {
    // Swap token positions
    const tempAmount = outputAmount
    setInputAmount(tempAmount)
    setOutputAmount('')
  }

  const getPriceImpactColor = (impact: string) => {
    const impactNum = parseFloat(impact)
    if (impactNum < 1) return 'text-green-400'
    if (impactNum < 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  const isHighPriceImpact = parseFloat(priceImpact) > 3

  return (
    <div className={clsx('bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6', className)}>
      {/* Input Token */}
      <div className="space-y-4">
        <div className="bg-gray-700/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You pay</span>
            <span className="text-sm text-gray-400">Balance: 0.00</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold placeholder-gray-500 outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-600 rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
              <span className="font-medium">{selectedTokenA?.symbol || 'Select'}</span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleFlipTokens}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border-4 border-gray-800 transition-colors"
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-gray-700/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
            <span className="text-sm text-gray-400">Balance: 0.00</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={isCalculating ? 'Calculating...' : outputAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold placeholder-gray-500 outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-600 rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full" />
              <span className="font-medium">{selectedTokenB?.symbol || 'Select'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Impact Warning */}
      {priceImpact && (
        <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Price Impact</span>
            <span className={getPriceImpactColor(priceImpact)}>
              {parseFloat(priceImpact).toFixed(2)}%
            </span>
          </div>
          {isHighPriceImpact && (
            <div className="flex items-center space-x-2 mt-2 text-red-400">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-xs">High price impact trade</span>
            </div>
          )}
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!isConnected || !inputAmount || !outputAmount || isSwapping || isCalculating}
        className={clsx(
          'w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-colors',
          !isConnected
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : isHighPriceImpact
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white',
          (isSwapping || isCalculating) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {!isConnected 
          ? 'Connect Wallet'
          : isSwapping 
          ? 'Swapping...'
          : isCalculating
          ? 'Calculating...'
          : isHighPriceImpact
          ? 'Swap Anyway'
          : 'Swap'
        }
      </button>

      {/* Position Info */}
      <div className="mt-4 p-3 bg-gray-700/20 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <InformationCircleIcon className="h-4 w-4" />
          <span>
            Trading in {isLongPosition ? 'Long' : 'Short'} position - 
            {isLongPosition 
              ? ' betting on price increase' 
              : ' betting on price decrease'
            }
          </span>
        </div>
      </div>
    </div>
  )
}

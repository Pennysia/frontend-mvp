'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, ArrowsUpDownIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { 
  PennysiaSDK, 
  ChainId, 
  PENNYSIA_CONSTANTS,
  parseTokenAmount,
  formatTokenAmount,
  calculateMinimumAmount,
  parseContractError
} from '../lib'
// Constants will be imported from lib
import toast from 'react-hot-toast'
import clsx from 'clsx'
import TokenSelectorModal, { type Token } from './TokenSelectorModal'
import { ROUTER_ABI, MARKET_ABI } from '../lib/abis'
import { getMarketAddress, getRouterAddress } from '../lib/sdk-utils'
import TransactionLoadingOverlay from './ui/TransactionLoadingOverlay'

interface SwapInterfaceProps {
  className?: string
}

export default function SwapInterface({ className }: SwapInterfaceProps) {
  const { ready, authenticated, login } = usePrivy()
  const { wallets } = useWallets()

  // Get wallet info from Privy
  const isConnected = authenticated && wallets.length > 0
  const address = wallets.length > 0 ? wallets[0].address : null

  // Local state
  const [selectedTokenA, setSelectedTokenA] = useState<Token | null>(null)
  const [selectedTokenB, setSelectedTokenB] = useState<Token | null>(null)
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [isCalculatingOutput, setIsCalculatingOutput] = useState(false) // When typing in "You Pay"
  const [isCalculatingInput, setIsCalculatingInput] = useState(false)   // When typing in "You Receive"
  const [activeField, setActiveField] = useState<'input' | 'output' | null>(null) // Track which field user is typing in
  const [swapPrice, setSwapPrice] = useState('')
  const [slippage, setSlippage] = useState(PENNYSIA_CONSTANTS.DEFAULT_SLIPPAGE_BPS / 100) // 0.5%
  const [showSettings, setShowSettings] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [showTokenSelectorA, setShowTokenSelectorA] = useState(false)
  const [showTokenSelectorB, setShowTokenSelectorB] = useState(false)
  const [sdk, setSdk] = useState<PennysiaSDK | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showTransactionResult, setShowTransactionResult] = useState(false)
  const [transactionResult, setTransactionResult] = useState<{
    success: boolean
    txHash?: string
    error?: string
    amountIn?: string
    amountOut?: string
    tokenInSymbol?: string
    tokenOutSymbol?: string
  } | null>(null)

  // Add a ref to store the timeout ID
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Track which field is being actively edited to prevent loops
  const isUpdating = useRef({ input: false, output: false })

  // Initialize SDK when wallet is connected
  useEffect(() => {
    const initializeSDK = async () => {
      if (!isConnected || !wallets.length) {
        if (sdk) {
          setSdk(null)
        }
        return
      }

      // Avoid re-initializing if SDK already exists and wallet hasn't changed
      if (sdk && wallets[0]?.address === address) {
        return
      }

      try {
        const wallet = wallets[0]
        const provider = await wallet.getEthereumProvider()
        const ethersProvider = new ethers.BrowserProvider(provider)
        const signer = await ethersProvider.getSigner()

        // For MVP, default to Sonic Blaze Testnet
        const chainId = ChainId.SONIC_BLAZE_TESTNET
        const rpcUrl = 'https://rpc.blaze.soniclabs.com'
        const rpcProvider = new ethers.JsonRpcProvider(rpcUrl)

        const sdkInstance = PennysiaSDK.create(chainId, rpcProvider, signer)
        setSdk(sdkInstance)
        setError(null)
      } catch (err: any) {
        console.error('Failed to initialize SDK:', err)
        setError(err.message || 'Failed to initialize SDK')
        setSdk(null)
      }
    }

    initializeSDK()
  }, [isConnected, address, sdk])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }
    }
  }, [])

  // Sort tokens to determine token0/token1 (lexicographic order)
  const sortTokens = (tokenA: Token, tokenB: Token): [Token, Token] => {
    return tokenA.address.toLowerCase() < tokenB.address.toLowerCase() 
      ? [tokenA, tokenB] 
      : [tokenB, tokenA]
  }

  // Get reserves from Market contract
  const getPoolReserves = async (token0: Token, token1: Token): Promise<{ reserve0: bigint; reserve1: bigint } | null> => {
    const marketAddress = getMarketAddress(ChainId.SONIC_BLAZE_TESTNET)
    try {
      if (!isConnected || !wallets.length) {
        // Use public RPC for read-only operations
        const provider = new ethers.JsonRpcProvider('https://rpc.blaze.soniclabs.com')
        const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider)
        
        const [reserve0Long, reserve0Short, reserve1Long, reserve1Short] = await marketContract.getReserves(token0.address, token1.address)
        
        return {
          reserve0: reserve0Long + reserve0Short, // Total reserve0 = Long + Short
          reserve1: reserve1Long + reserve1Short  // Total reserve1 = Long + Short
        }
      } else {
        // Use wallet provider
        const wallet = wallets[0]
        const provider = await wallet.getEthereumProvider()
        const ethersProvider = new ethers.BrowserProvider(provider)
        const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, ethersProvider)
        
        const [reserve0Long, reserve0Short, reserve1Long, reserve1Short] = await marketContract.getReserves(token0.address, token1.address)
        
        return {
          reserve0: reserve0Long + reserve0Short,
          reserve1: reserve1Long + reserve1Short
        }
      }
    } catch (error) {
      console.error('Error fetching pool reserves:', error)
      return null
    }
  }

  // Calculate output amount using Router's getAmountOut
  const calculateOutputAmount = async (inputAmountValue: string, tokenIn: Token, tokenOut: Token): Promise<string> => {
    try {
      if (!inputAmountValue || !tokenIn || !tokenOut || Number(inputAmountValue) <= 0) {
        return ''
      }

      // Sort tokens to determine token0/token1
      const [token0, token1] = sortTokens(tokenIn, tokenOut)
      const isToken0Input = tokenIn.address.toLowerCase() === token0.address.toLowerCase()

      // Get pool reserves
      const reserves = await getPoolReserves(token0, token1)
      if (!reserves || reserves.reserve0 === 0n || reserves.reserve1 === 0n) {
        return ''
      }

      // Parse input amount with correct decimals
      const amountIn = ethers.parseUnits(inputAmountValue, tokenIn.decimals)
      
      // Determine reserve in and reserve out based on token order
      const reserveIn = isToken0Input ? reserves.reserve0 : reserves.reserve1
      const reserveOut = isToken0Input ? reserves.reserve1 : reserves.reserve0

      // Get provider for Router contract call
      let provider: ethers.Provider
      if (isConnected && wallets.length > 0) {
        const wallet = wallets[0]
        const ethersProvider = await wallet.getEthereumProvider()
        provider = new ethers.BrowserProvider(ethersProvider)
      } else {
        provider = new ethers.JsonRpcProvider('https://rpc.blaze.soniclabs.com')
      }

      const routerContract = new ethers.Contract(getRouterAddress(ChainId.SONIC_BLAZE_TESTNET), ROUTER_ABI, provider)
      const amountOut = await routerContract.getAmountOut(amountIn, reserveIn, reserveOut)
      
      // Format output amount with correct decimals
      return ethers.formatUnits(amountOut, tokenOut.decimals)
    } catch (error) {
      console.error('Error calculating output amount:', error)
      return ''
    }
  }

  // Calculate input amount using Router's getAmountIn
  const calculateInputAmount = async (outputAmountValue: string, tokenIn: Token, tokenOut: Token): Promise<string> => {
    try {
      if (!outputAmountValue || !tokenIn || !tokenOut || Number(outputAmountValue) <= 0) {
        return ''
      }

      // Sort tokens to determine token0/token1
      const [token0, token1] = sortTokens(tokenIn, tokenOut)
      const isToken0Input = tokenIn.address.toLowerCase() === token0.address.toLowerCase()

      // Get pool reserves
      const reserves = await getPoolReserves(token0, token1)
      if (!reserves || reserves.reserve0 === 0n || reserves.reserve1 === 0n) {
        return ''
      }

      // Parse output amount with correct decimals
      const amountOut = ethers.parseUnits(outputAmountValue, tokenOut.decimals)

      // Determine reserve in and reserve out based on token order
      const reserveIn = isToken0Input ? reserves.reserve0 : reserves.reserve1
      const reserveOut = isToken0Input ? reserves.reserve1 : reserves.reserve0

      // Get provider for Router contract call
      let provider: ethers.Provider
      if (isConnected && wallets.length > 0) {
        const wallet = wallets[0]
        const ethersProvider = await wallet.getEthereumProvider()
        provider = new ethers.BrowserProvider(ethersProvider)
      } else {
        provider = new ethers.JsonRpcProvider('https://rpc.blaze.soniclabs.com')
      }

      const routerContract = new ethers.Contract(getRouterAddress(ChainId.SONIC_BLAZE_TESTNET), ROUTER_ABI, provider)
      const amountIn = await routerContract.getAmountIn(amountOut, reserveIn, reserveOut)
      
      // Format input amount with correct decimals
      return ethers.formatUnits(amountIn, tokenIn.decimals)
    } catch (error) {
      console.error('Error calculating input amount:', error)
      return ''
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTokenSelectorA(false)
      setShowTokenSelectorB(false)
    }

    if (showTokenSelectorA || showTokenSelectorB) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showTokenSelectorA, showTokenSelectorB])

  // Note: Scroll locking is now handled by TokenSelectorModal component

  // Handle input amount changes and calculate output
  const handleInputAmountChange = async (value: string) => {
    if (isUpdating.current.input) return // Prevent re-entry
    
    setInputAmount(value)
    setActiveField('input')
    
    if (!value || !selectedTokenA || !selectedTokenB || Number(value) <= 0) {
      setOutputAmount('')
      setSwapPrice('')
      setIsCalculatingOutput(false)
      setActiveField(null)
      return
    }

    try {
      isUpdating.current.input = true
      setIsCalculatingOutput(true)
      const calculatedOutput = await calculateOutputAmount(value, selectedTokenA, selectedTokenB)
      if (!isUpdating.current.output) { // Only update if output isn't being actively edited
        setOutputAmount(calculatedOutput)
      }
    } catch (error) {
      console.error('Error calculating output amount:', error)
    } finally {
      setIsCalculatingOutput(false)
      isUpdating.current.input = false
      setActiveField(null)
    }
  }

  // Handle output amount changes and calculate input
  const handleOutputAmountChange = (value: string) => {
    if (isUpdating.current.output) return // Prevent re-entry
    
    setOutputAmount(value)
    setActiveField('output')
    
    if (!value || !selectedTokenA || !selectedTokenB || Number(value) <= 0) {
      setInputAmount('')
      setSwapPrice('')
      setIsCalculatingInput(false)
      setActiveField(null)
      return
    }

    // Debounce the calculation to avoid interfering with typing
    setIsCalculatingInput(true)
    
    // Clear any existing timeout
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current)
    }
    
    // Set a new timeout for calculation
    calculationTimeoutRef.current = setTimeout(async () => {
      try {
        isUpdating.current.output = true
        const calculatedInput = await calculateInputAmount(value, selectedTokenA, selectedTokenB)
        if (!isUpdating.current.input) { // Only update if input isn't being actively edited
          setInputAmount(calculatedInput)
        }
      } catch (error) {
        console.error('Error calculating input amount:', error)
        setInputAmount('')
      } finally {
        setIsCalculatingInput(false)
        isUpdating.current.output = false
        setActiveField(null)
      }
    }, 500) // 500ms delay
  }

  // Handle token switching
  const handleSwitchTokens = () => {
    if (!selectedTokenA || !selectedTokenB) return
    
    // Store the current values
    const oldInput = inputAmount
    const oldOutput = outputAmount
    
    // Switch tokens
    setSelectedTokenA(selectedTokenB)
    setSelectedTokenB(selectedTokenA)
    
    // Swap the input and output amounts
    setInputAmount(oldOutput)
    setOutputAmount(oldInput)
    
    // Force a recalculation by setting the active field to 'input'
    setActiveField('input')
    
    // If there was an input amount, trigger a recalculation
    if (oldOutput) {
      handleInputAmountChange(oldOutput)
    }
  }

  // Calculate output amount when input changes or tokens are switched
  useEffect(() => {
    // Only calculate output if input is being edited or tokens have changed
    if (activeField !== 'input') {
      return
    }

    if (!inputAmount || !selectedTokenA || !selectedTokenB) {
      setOutputAmount('')
      setSwapPrice('')
      return
    }

  let isMounted = true
  let timeoutId: NodeJS.Timeout

  const calculateOutput = async () => {
    try {
      setIsCalculatingOutput(true)
      const calculatedOutput = await calculateOutputAmount(inputAmount, selectedTokenA, selectedTokenB)
      if (isMounted) {
        setOutputAmount(calculatedOutput)
        // Calculate and set the average swap price
        setSwapPrice(calculateSwapPrice(inputAmount, calculatedOutput))
      }
    } catch (error: any) {
      console.error('Error calculating output:', error)
      // Fallback to mock calculation if contract call fails
      try {
        const inputAmountWei = parseTokenAmount(inputAmount, selectedTokenA.decimals)
        const mockOutputWei = (BigInt(inputAmountWei) * BigInt(95) / BigInt(100)).toString()
        const formattedOutput = formatTokenAmount(mockOutputWei, selectedTokenB.decimals)
        if (isMounted) {
          setOutputAmount(formattedOutput)
          setSwapPrice(calculateSwapPrice(inputAmount, formattedOutput))
        }
      } catch {
        if (isMounted) {
          setOutputAmount('')
          setSwapPrice('')
        }
      }
    } finally {
      if (isMounted) {
        setIsCalculatingOutput(false)
      }
    }
  }

  // Clear any existing timeout to prevent multiple executions
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  // Set new timeout
  timeoutId = setTimeout(calculateOutput, 300) // Debounce 300ms

  return () => {
    isMounted = false
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}, [inputAmount, selectedTokenA, selectedTokenB, sdk])

  const handleSwap = async () => {
    if (!isConnected || !selectedTokenA || !selectedTokenB || !inputAmount || !outputAmount) {
      toast.error('Please connect wallet and enter amounts')
      return
    }

    try {
      setIsSwapping(true)

      // Get provider and signer
      const wallet = wallets[0]
      const provider = await wallet.getEthereumProvider()
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()

      // Router address
      const routerAddress = getRouterAddress(ChainId.SONIC_BLAZE_TESTNET)

      // Create Router contract instance with signer
      const routerContract = new ethers.Contract(
        routerAddress,
        ROUTER_ABI,
        signer
      )

      // Parse amounts
      const inputAmountWei = ethers.parseUnits(inputAmount, selectedTokenA.decimals)
      const outputAmountWei = ethers.parseUnits(outputAmount, selectedTokenB.decimals)
      const minOutputAmount = outputAmountWei * BigInt(100 - Math.floor(slippage * 100)) / BigInt(100) // Apply slippage tolerance

      // Create swap path
      const path = [selectedTokenA.address, selectedTokenB.address]

      // Calculate deadline (15 minutes from now)
      const deadline = Math.floor(Date.now() / 1000) + PENNYSIA_CONSTANTS.DEFAULT_DEADLINE_SECONDS

      // Check if we need to approve tokens first
      const tokenContract = new ethers.Contract(
        selectedTokenA.address,
        ['function allowance(address owner, address spender) view returns (uint256)', 'function approve(address spender, uint256 amount) returns (bool)'],
        signer
      )

      const currentAllowance = await tokenContract.allowance(address, routerAddress)

      // Approve if needed
      if (BigInt(currentAllowance) < BigInt(inputAmountWei)) {
        const approveTx = await tokenContract.approve(routerAddress, inputAmountWei)
        await approveTx.wait()
      }

      // Execute swap
      const swapTx = await routerContract.swap(
        inputAmountWei,
        minOutputAmount,
        path,
        address,
        deadline
      )

      // Wait for transaction confirmation
      const receipt = await swapTx.wait()
      
      if (receipt.status === 1) {
        // Show success result
        setTransactionResult({
          success: true,
          txHash: receipt.hash,
          amountIn: inputAmount,
          amountOut: outputAmount,
          tokenInSymbol: selectedTokenA.symbol,
          tokenOutSymbol: selectedTokenB.symbol
        })
        setShowTransactionResult(true)
        
        // Clear form
        setInputAmount('')
        setOutputAmount('')
        setSwapPrice('')
      } else {
        throw new Error('Transaction failed')
      }

    } catch (error: any) {
      console.error('Swap error:', error)
      
      // Show error result
      setTransactionResult({
        success: false,
        error: error.message || 'Transaction failed',
        amountIn: inputAmount,
        amountOut: outputAmount,
        tokenInSymbol: selectedTokenA.symbol,
        tokenOutSymbol: selectedTokenB.symbol
      })
      setShowTransactionResult(true)
    } finally {
      setIsSwapping(false)
    }
  }

  const handleTokenASelection = (token: Token | null) => {
    if (!token) {
      setSelectedTokenA(null)
      setShowTokenSelectorA(false)
      return
    }
    
    if (selectedTokenB && token.address === selectedTokenB.address) {
      toast.error('Cannot select the same token for both positions')
      return
    }
    
    // Create a new token object with the balance from the selected token
    const tokenWithBalance = {
      ...token,
      balance: token.balance || '0.00'
    }
    
    setSelectedTokenA(tokenWithBalance)
    setShowTokenSelectorA(false)
  }

  const handleTokenBSelection = (token: Token | null) => {
    if (!token) {
      setSelectedTokenB(null)
      setShowTokenSelectorB(false)
      return
    }
    
    if (selectedTokenA && token.address === selectedTokenA.address) {
      toast.error('Cannot select the same token for both positions')
      return
    }
    
    // Create a new token object with the balance from the selected token
    const tokenWithBalance = {
      ...token,
      balance: token.balance || '0.00'
    }
    
    setSelectedTokenB(tokenWithBalance)
    setShowTokenSelectorB(false)
  }

  const handleTokenSelectorAClick = () => {
    setShowTokenSelectorA(true)
  }

  const handleTokenSelectorBClick = () => {
    setShowTokenSelectorB(true)
  }

  const handleFlipTokens = () => {
    // Swap token positions
    const tempTokenA = selectedTokenA
    const tempAmount = outputAmount
    setSelectedTokenA(selectedTokenB)
    setSelectedTokenB(tempTokenA)
    setInputAmount(tempAmount)
    setOutputAmount('')
  }

  // Calculate average swap price (output/input)
  const calculateSwapPrice = (input: string, output: string): string => {
    if (!input || !output || parseFloat(input) === 0) return ''
    const price = parseFloat(output) / parseFloat(input)
    return price.toFixed(6)
  }

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <div className={clsx('relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 w-full max-w-md mx-auto', className)}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={clsx('relative dark:bg-[var(--background)] backdrop-blur-sm rounded-2xl border border-gray-800 p-4 w-full max-w-md mx-auto', className)}>
        {/* Input Token */}
      <div className="space-y-2 mb-2">
        <div className="relative bg-gray-200/50 dark:bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You pay</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                Balance: {selectedTokenA ? (selectedTokenA.balance || '0.00') : '0.00'}
              </span>
              {selectedTokenA?.balance && parseFloat(selectedTokenA.balance) > 0 && (
                <button 
                  onClick={() => {
                    const maxAmount = selectedTokenA.balance || '0';
                    setInputAmount(maxAmount);
                    handleInputAmountChange(maxAmount);
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300"
                  disabled={isSwapping || isCalculatingInput || isCalculatingOutput}
                >
                  Max
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              inputMode="decimal"
              value={isCalculatingInput && activeField !== 'input' ? 'Calculating...' : inputAmount}
              onChange={(e) => {
                const value = e.target.value
                // Only allow numbers, decimal point, and prevent negative values
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleInputAmountChange(value)
                }
              }}
              onKeyDown={(e) => {
                // Prevent 'e', 'E', '+', '-' keys
                if (['e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault()
                }
              }}
              placeholder="0.0"
              className="flex-1 bg-transparent text-xl sm:text-2xl font-semibold placeholder-gray-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
            />
            <div className="flex-shrink-0">
              <button
                onClick={handleTokenSelectorAClick}
                className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors bg-white dark:bg-gray-800 hover:bg-gray-600 w-[120px]"
              >
                <div className="flex items-center space-x-2">
                  {selectedTokenA ? (
                    <>
                      {selectedTokenA.logoURI ? (
                        <img
                          src={selectedTokenA.logoURI}
                          alt={selectedTokenA.symbol}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          selectedTokenA.logoURI ? 'hidden' : 'flex'
                        }`}
                      >
                        {selectedTokenA.symbol[0]}
                      </div>
                      <span className="font-semibold text-sm">{selectedTokenA.symbol}</span>
                    </>
                  ) : (
                    <span className="text-gray-500 font-normal text-xs">Select Token</span>
                  )}
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-800 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Switch tokens button */}
        <button
          onClick={handleSwitchTokens}
          className="border border-white dark:border-gray-600 absolute left-1/2 -translate-x-1/2 -translate-y-2/3 z-10 p-2 rounded-xl dark:bg-[var(--background)] bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowsUpDownIcon className="h-5 w-5 text-gray-500" />
        </button>

        {/* Output Token */}
        <div className="relative bg-gray-200/50 dark:bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
            <span className="text-sm text-gray-400">
              Balance: {selectedTokenB ? (selectedTokenB.balance || '0.00') : '0.00'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              inputMode="decimal"
              value={isCalculatingOutput && activeField !== 'output' ? 'Calculating...' : outputAmount}
              onChange={(e) => {
                const value = e.target.value
                // Only allow numbers, decimal point, and prevent negative values
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleOutputAmountChange(value)
                }
              }}
              onKeyDown={(e) => {
                // Prevent 'e', 'E', '+', '-' keys
                if (['e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault()
                }
              }}
              placeholder="0.0"
              className="flex-1 bg-transparent text-xl sm:text-2xl font-semibold placeholder-gray-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
              disabled={isCalculatingOutput}
            />
            <div className="flex-shrink-0">
              <button
                onClick={handleTokenSelectorBClick}
                className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors bg-white dark:bg-gray-800  hover:bg-gray-600 w-[120px]"
              >
                <div className="flex items-center space-x-2">
                  {selectedTokenB ? (
                    <>
                      {selectedTokenB.logoURI ? (
                        <img
                          src={selectedTokenB.logoURI}
                          alt={selectedTokenB.symbol}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          selectedTokenB.logoURI ? 'hidden' : 'flex'
                        }`}
                      >
                        {selectedTokenB.symbol[0]}
                      </div>
                      <span className="font-semibold text-sm">{selectedTokenB.symbol}</span>
                    </>
                  ) : (
                    <span className="text-gray-500 font-normal text-xs">Select Token</span>
                  )}
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-800 dark:text-gray-400" />
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Price Impact Warning */}
      {swapPrice && (
        <div className=" p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-light text-xs">Average Price:</span>
            <span className="text-gray-900 dark:text-gray-200 font-light text-xs">
              1 {selectedTokenA?.symbol} = {swapPrice} {selectedTokenB?.symbol}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-light text-xs">Inverse Price:</span>
            <span className="text-gray-900 dark:text-gray-200 font-light text-xs">
              1 {selectedTokenB?.symbol} = {(1 / parseFloat(swapPrice) || 0).toFixed(6)} {selectedTokenA?.symbol}
            </span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={!isConnected ? login : handleSwap}
        disabled={isConnected && (!inputAmount || !outputAmount || isSwapping || isCalculatingInput || isCalculatingOutput)}
        className={clsx(
          'w-full py-3 px-4 rounded-xl text-white font-medium transition-all',
          'focus:outline-none focus:ring-opacity-50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center space-x-2',
          'border-2',
          !isConnected
            ? 'border-transparent bg-blue-500 hover:bg-blue-600'
            : !inputAmount || !outputAmount || isSwapping
            ? 'border-gray-600 bg-gray-700 cursor-not-allowed'
            : 'border-purple-500 bg-purple-500 hover:bg-purple-500/20 hover:text-purple-500 focus:ring-2 focus:ring-purple-500'
        )}
      >
        {!isConnected
          ? 'Connect Wallet'
          : isSwapping
            ? 'Swapping...'
            : (isCalculatingOutput || isCalculatingInput)
              ? 'Calculating...'
              : 'Swap'}
      </button>
      </div>

      {/* Token Selector Modals */}
      <TokenSelectorModal
        isOpen={showTokenSelectorA}
        onClose={() => setShowTokenSelectorA(false)}
        onTokenSelect={handleTokenASelection}
        title="Select a token to pay"
        excludeToken={selectedTokenB}
      />
      
      <TokenSelectorModal
        isOpen={showTokenSelectorB}
        onClose={() => setShowTokenSelectorB(false)}
        onTokenSelect={handleTokenBSelection}
        title="Select a token to receive"
        excludeToken={selectedTokenA}
      />
      
      {/* Transaction Loading Overlay */}
      <TransactionLoadingOverlay 
        isVisible={isSwapping}
        title="Processing Swap..."
        subtitle="Please confirm the transaction in your wallet"
      />
      
      {/* Transaction Result Modal */}
      {showTransactionResult && transactionResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md mx-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {transactionResult.success ? 'Swap Successful!' : 'Swap Failed'}
              </h3>
              <button
                onClick={() => setShowTransactionResult(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="space-y-4">
              {transactionResult.success ? (
                <>
                  {/* Success Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">You Paid:</span>
                      <span className="text-white font-medium">
                        {transactionResult.amountIn} {transactionResult.tokenInSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">You Received:</span>
                      <span className="text-white font-medium">
                        {transactionResult.amountOut} {transactionResult.tokenOutSymbol}
                      </span>
                    </div>
                    {transactionResult.txHash && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction:</span>
                        <a 
                          href={`https://explorer.soniclabs.com/tx/${transactionResult.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                        >
                          {transactionResult.txHash.slice(0, 6)}...{transactionResult.txHash.slice(-4)}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Error Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Error Details */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm mb-2">Error:</p>
                    <p className="text-white text-sm">{transactionResult.error}</p>
                  </div>
                  
                  {/* Attempted Transaction Details */}
                  <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Attempted to Pay:</span>
                      <span className="text-white font-medium">
                        {transactionResult.amountIn} {transactionResult.tokenInSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected to Receive:</span>
                      <span className="text-white font-medium">
                        {transactionResult.amountOut} {transactionResult.tokenOutSymbol}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setShowTransactionResult(false)}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

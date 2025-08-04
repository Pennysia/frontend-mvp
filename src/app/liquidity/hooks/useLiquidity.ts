'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { ChainId, getMarketAddress, getRouterAddress } from '../../../lib/sdk-utils'
import { MARKET_ABI, ROUTER_ABI, ERC20_ABI, LIQUIDITY_ABI } from '../../../lib/abis'
import { useStore } from '../../../store/useStore'

// Use proper ABIs from lib directory

export interface LiquidityPosition {
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
  // Pool reserves (total)
  reserve0Long: string
  reserve0Short: string
  reserve1Long: string
  reserve1Short: string
  // User's LP token amounts
  userLongX: string    // User's longX LP tokens (Token0 Long)
  userShortX: string   // User's shortX LP tokens (Token0 Short)
  userLongY: string    // User's longY LP tokens (Token1 Long)
  userShortY: string   // User's shortY LP tokens (Token1 Short)
  totalShares: string
  myShares: string
  sharePercent: string
}

export interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  balance: string
}

export function useLiquidity() {
  const { isConnected, address, provider, signer, chainId } = useStore()
  
  // Debug: Log the actual values from useStore
  console.log('useLiquidity - useStore values:', {
    isConnected,
    address,
    provider: !!provider,
    signer: !!signer,
    chainId
  })
  const [positions, setPositions] = useState<LiquidityPosition[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize SDK and contracts
  const getProvider = useCallback(async () => {
    if (!isConnected || !address || !provider) return null
    
    // Use the provider from useStore
    return provider
  }, [isConnected, address, provider])

  const getSigner = useCallback(async () => {
    if (!isConnected || !address || !signer) return null
    
    // Use the signer from useStore
    return signer
  }, [isConnected, address, signer])

  // Check token allowance
  const checkTokenAllowance = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
    decimals: number = 18
  ): Promise<boolean> => {
    try {
      const provider = await getProvider()
      if (!provider || !address) return false

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const allowance = await tokenContract.allowance(address, spenderAddress)
      
      return ethers.parseUnits(amount, decimals) <= allowance
    } catch (error) {
      console.error('Error checking allowance:', error)
      return false
    }
  }, [getProvider, address])

  // Approve token spending
  const approveToken = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
    decimals: number = 18
  ): Promise<boolean> => {
    try {
      const signer = await getSigner()
      if (!signer) throw new Error('No signer available')

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
      
      // Use maximum uint256 value for approval to avoid precision issues
      // This is a common pattern used by many DeFi protocols
      const maxApproval = ethers.MaxUint256
      
      console.log(`Approving token ${tokenAddress} for spender ${spenderAddress} with max allowance`)
      
      const tx = await tokenContract.approve(spenderAddress, maxApproval)
      console.log('Approval transaction sent:', tx.hash)
      
      const receipt = await tx.wait()
      console.log('Approval transaction confirmed:', receipt.hash)
      
      return true
    } catch (error) {
      console.error('Error approving token:', error)
      throw error
    }
  }, [getSigner])

  // Get token info
  const getTokenInfo = useCallback(async (tokenAddress: string): Promise<TokenInfo | null> => {
    try {
      const provider = await getProvider()
      if (!provider || !address) return null

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const [symbol, decimals, balance] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.balanceOf(address)
      ])

      return {
        address: tokenAddress,
        symbol,
        decimals,
        balance: ethers.formatUnits(balance, decimals)
      }
    } catch (error) {
      console.error('Error getting token info:', error)
      return null
    }
  }, [getProvider, address])

  // Fetch user's liquidity positions
  const fetchPositions = useCallback(async () => {
    if (!isConnected || !address) {
      console.log('fetchPositions: Not connected or no wallet address')
      return
    }

    console.log('fetchPositions: Starting to fetch positions for', address)
    setLoading(true)
    setError(null)

    try {
      const provider = await getProvider()
      if (!provider) throw new Error('No provider available')

      const marketAddress = getMarketAddress(ChainId.SONIC_BLAZE_TESTNET)
      const routerAddress = getRouterAddress(ChainId.SONIC_BLAZE_TESTNET)
      if (!marketAddress || !routerAddress) throw new Error('Market or Router contract not deployed on this network')
      
      console.log('fetchPositions: Using market address:', marketAddress)
      const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider)
      const routerContract = new ethers.Contract(routerAddress, ROUTER_ABI, provider)
      
      // Optimized approach: First get Create events to find existing pairs, then check user balances
      // This is much faster than checking 1000+ pairs sequentially
      console.log('fetchPositions: Finding existing pairs through Create events...')
      
      const userPositions: LiquidityPosition[] = []
      
      // Alternative approach: Query Mint events filtered by user address
      // This finds pairs where the user has actually added liquidity
      console.log('fetchPositions: Querying Mint events for user positions...')
      
      try {
        // Get Mint events from a much larger block range to catch older positions
        const currentBlock = await provider.getBlockNumber()
        const fromBlock = Math.max(0, currentBlock - 5000000) // Increased to 5M blocks
        
        console.log(`fetchPositions: Searching Mint events from block ${fromBlock} to ${currentBlock}`)
        
        // Query Mint events where the user is the 'to' address (received LP tokens)
        const mintFilter = marketContract.filters.Mint(null, address, null)
        const mintEvents = await marketContract.queryFilter(mintFilter, fromBlock, currentBlock)
        
        console.log(`fetchPositions: Found ${mintEvents.length} Mint events for user`)
        
        // Track unique pair IDs to avoid duplicates
        const processedPairs = new Set<string>()
        
        // Check user's current balance for each pair they've minted in
        for (const event of mintEvents) {
          try {
            // Type guard to ensure we have an EventLog with args
            if (!('args' in event) || !event.args) {
              console.log('fetchPositions: Skipping Mint event with no args')
              continue
            }
            
            const pairId = event.args[2] // pairId is the third argument in Mint event
            const pairIdStr = pairId.toString()
            
            // Skip if we've already processed this pair
            if (processedPairs.has(pairIdStr)) {
              continue
            }
            processedPairs.add(pairIdStr)
            
            console.log(`fetchPositions: Checking current balance for pair ${pairIdStr}`)
            
            // Get user's current LP token balance for this pair
            const [longX, shortX, longY, shortY] = await marketContract.balanceOf(address, pairId)
            
            // Only create position if user currently has balance
            if (longX > 0n || shortX > 0n || longY > 0n || shortY > 0n) {
              console.log(`fetchPositions: Found current balance in pair ${pairIdStr}:`, {
                longX: longX.toString(),
                shortX: shortX.toString(),
                longY: longY.toString(),
                shortY: shortY.toString()
              })
              
              // Find the Create event for this pair to get token addresses
              let token0Address = '0x0000000000000000000000000000000000000000'
              let token1Address = '0x0000000000000000000000000000000000000000'
              let token0Symbol = 'TKN0'
              let token1Symbol = 'TKN1'
              
              // Store reserves data for later use
              let reserveData = {
                reserve0Long: '0',
                reserve0Short: '0', 
                reserve1Long: '0',
                reserve1Short: '0'
              }
              
              try {
                console.log(`fetchPositions: Looking for Create event for pair ${pairIdStr}`)
                
                // Query Create events to find the one with matching pairId
                const createFilter = marketContract.filters.Create()
                const createEvents = await marketContract.queryFilter(createFilter, fromBlock, currentBlock)
                
                for (const createEvent of createEvents) {
                  if ('args' in createEvent && createEvent.args) {
                    const createPairId = createEvent.args[2]?.toString()
                    if (createPairId === pairIdStr) {
                      const rawToken0 = createEvent.args[0]?.toString() || token0Address
                      const rawToken1 = createEvent.args[1]?.toString() || token1Address
                      
                      // Ensure proper token ordering (token0 < token1) as required by Pennysia AMM
                      if (rawToken0.toLowerCase() < rawToken1.toLowerCase()) {
                        token0Address = rawToken0
                        token1Address = rawToken1
                      } else {
                        token0Address = rawToken1
                        token1Address = rawToken0
                      }
                      
                      console.log(`fetchPositions: Found and ordered token addresses for pair ${pairIdStr}:`, {
                        token0Address,
                        token1Address,
                        rawToken0,
                        rawToken1
                      })
                      
                      // Verify that these token addresses will generate the same pair ID
                      try {
                        const computedPairId = await marketContract.getPairId(token0Address, token1Address)
                        console.log(`fetchPositions: Verification - computed pair ID: ${computedPairId.toString()}, original: ${pairIdStr}`)
                        if (computedPairId.toString() !== pairIdStr) {
                          console.warn(`fetchPositions: PAIR ID MISMATCH! Computed: ${computedPairId.toString()}, Original: ${pairIdStr}`)
                        } else {
                          console.log(`fetchPositions: ✅ Pair ID verification PASSED!`)
                        }
                      } catch (verifyError) {
                        console.error(`fetchPositions: Could not verify pair ID for ${pairIdStr}:`, verifyError)
                      }
                      
                      // Get token symbols
                      try {
                        const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, provider)
                        const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, provider)
                        
                        const [symbol0, symbol1] = await Promise.all([
                          token0Contract.symbol(),
                          token1Contract.symbol()
                        ])
                        
                        token0Symbol = symbol0
                        token1Symbol = symbol1
                      } catch (symbolError) {
                        console.warn(`fetchPositions: Could not fetch token symbols for pair ${pairIdStr}:`, symbolError)
                      }
                      
                      // Calculate actual token values using quoteReserve
                      try {
                        const reserves = await routerContract.quoteReserve(
                          token0Address, 
                          token1Address, 
                          longX, 
                          shortX, 
                          longY, 
                          shortY
                        )
                        const [amountLong0, amountShort0, amountLong1, amountShort1] = reserves
                        
                        console.log(`fetchPositions: Token values for pair ${pairIdStr}:`, {
                          amountLong0: amountLong0.toString(),
                          amountShort0: amountShort0.toString(),
                          amountLong1: amountLong1.toString(),
                          amountShort1: amountShort1.toString()
                        })
                        
                        reserveData = {
                          reserve0Long: ethers.formatUnits(amountLong0, 18),
                          reserve0Short: ethers.formatUnits(amountShort0, 18),
                          reserve1Long: ethers.formatUnits(amountLong1, 18),
                          reserve1Short: ethers.formatUnits(amountShort1, 18)
                        }
                      } catch (reserveError) {
                        console.warn(`fetchPositions: Could not fetch token values for pair ${pairIdStr}:`, reserveError)
                        // Fallback to default values
                        reserveData = {
                          reserve0Long: '0',
                          reserve0Short: '0',
                          reserve1Long: '0',
                          reserve1Short: '0'
                        }
                      }
                      
                      break
                    }
                  }
                }
              } catch (createError) {
                console.warn(`fetchPositions: Could not find Create event for pair ${pairIdStr}:`, createError)
              }
              
              const position: LiquidityPosition = {
                id: Number(pairId),
                pair: `${token0Symbol}/${token1Symbol}`,
                token0Symbol,
                token1Symbol,
                token0Address, // Real token0 address
                token1Address, // Real token1 address
                liquidity: ethers.formatUnits(longX + shortX + longY + shortY, 18),
                value: reserveData ? (
                  parseFloat(reserveData.reserve0Long) + 
                  parseFloat(reserveData.reserve0Short) + 
                  parseFloat(reserveData.reserve1Long) + 
                  parseFloat(reserveData.reserve1Short)
                ).toFixed(2) : '0.00',
                apr: '0.00%',
                fees24h: '0.00',
                pnl: '0.00',
                pnlPercent: '0.00%',
                isProfit: false,
                reserve0Long: reserveData.reserve0Long,
                reserve0Short: reserveData.reserve0Short,
                reserve1Long: reserveData.reserve1Long,
                reserve1Short: reserveData.reserve1Short,
                userLongX: ethers.formatUnits(longX, 18),
                userShortX: ethers.formatUnits(shortX, 18),
                userLongY: ethers.formatUnits(longY, 18),
                userShortY: ethers.formatUnits(shortY, 18),
                totalShares: ethers.formatUnits(longX + shortX + longY + shortY, 18),
                myShares: ethers.formatUnits(longX + shortX + longY + shortY, 18),
                sharePercent: '100.00%'
              }
              
              userPositions.push(position)
              console.log(`fetchPositions: Added position for pair ${pairIdStr}`)
            } else {
              console.log(`fetchPositions: No current balance in pair ${pairIdStr}, skipping`)
            }
          } catch (pairError) {
            console.error(`fetchPositions: Error processing Mint event:`, pairError)
            continue
          }
        }
        
        if (userPositions.length === 0) {
          console.log('fetchPositions: No current positions found from Mint events')
        }
        
      } catch (error) {
        console.error('fetchPositions: Error querying Mint events:', error)
        throw error
      }
      
      console.log('fetchPositions: Final user positions:', userPositions.length, 'positions found')
      setPositions(userPositions)
    } catch (error) {
      console.error('Error fetching positions:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch positions')
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, getProvider, getTokenInfo])

  // Add liquidity
  const addLiquidity = useCallback(async (
    token0Address: string,
    token1Address: string,
    amount0Long: string,
    amount0Short: string,
    amount1Long: string,
    amount1Short: string,
    token0Decimals: number = 18,
    token1Decimals: number = 18
  ) => {
    try {
      const signer = await getSigner()
      if (!signer) throw new Error('No signer available')

      // Get Router address instead of Market address
      const routerAddress = getRouterAddress(ChainId.SONIC_BLAZE_TESTNET)
      if (!routerAddress) throw new Error('Router contract not deployed')

      // Validate token addresses
      if (!ethers.isAddress(token0Address) || !ethers.isAddress(token1Address)) {
        throw new Error('Invalid token addresses provided')
      }

      // Check and approve tokens if needed (approve Router, not Market)
      const totalAmount0 = (parseFloat(amount0Long) + parseFloat(amount0Short)).toString()
      const totalAmount1 = (parseFloat(amount1Long) + parseFloat(amount1Short)).toString()

      console.log('Token approval check:', {
        token0Address,
        token1Address,
        routerAddress,
        totalAmount0,
        totalAmount1,
        token0Decimals,
        token1Decimals
      })

      const [allowance0, allowance1] = await Promise.all([
        checkTokenAllowance(token0Address, routerAddress, totalAmount0, token0Decimals),
        checkTokenAllowance(token1Address, routerAddress, totalAmount1, token1Decimals)
      ])

      console.log('Allowance check results:', { allowance0, allowance1 })

      if (!allowance0) {
        console.log('Approving token0...')
        await approveToken(token0Address, routerAddress, totalAmount0, token0Decimals)
        console.log('Token0 approved')
      }
      if (!allowance1) {
        console.log('Approving token1...')
        await approveToken(token1Address, routerAddress, totalAmount1, token1Decimals)
        console.log('Token1 approved')
      }

      // Double-check allowances after approval
      const [finalAllowance0, finalAllowance1] = await Promise.all([
        checkTokenAllowance(token0Address, routerAddress, totalAmount0, token0Decimals),
        checkTokenAllowance(token1Address, routerAddress, totalAmount1, token1Decimals)
      ])

      console.log('Final allowance check:', { finalAllowance0, finalAllowance1 })

      if (!finalAllowance0 || !finalAllowance1) {
        throw new Error(`Insufficient allowance after approval. Token0: ${finalAllowance0}, Token1: ${finalAllowance1}`)
      }

      // Execute add liquidity using Router contract
      const routerContract = new ethers.Contract(routerAddress, ROUTER_ABI, signer)
      const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

      // Parse amounts with correct decimals
      const parsedAmount0Long = ethers.parseUnits(amount0Long, token0Decimals)
      const parsedAmount0Short = ethers.parseUnits(amount0Short, token0Decimals)
      const parsedAmount1Long = ethers.parseUnits(amount1Long, token1Decimals)
      const parsedAmount1Short = ethers.parseUnits(amount1Short, token1Decimals)

      // Set minimum amounts (90% of expected for slippage protection)
      const longXMinimum = 0n // Will be calculated by Router
      const shortXMinimum = 0n
      const longYMinimum = 0n
      const shortYMinimum = 0n

      const tx = await routerContract.addLiquidity(
        token0Address,
        token1Address,
        parsedAmount0Long,
        parsedAmount0Short,
        parsedAmount1Long,
        parsedAmount1Short,
        longXMinimum,
        shortXMinimum,
        longYMinimum,
        shortYMinimum,
        address || '', // to
        deadline
      )

      await tx.wait()
      
      // Refresh positions after successful transaction
      await fetchPositions()
      
      return tx.hash
    } catch (error) {
      console.error('Error adding liquidity:', error)
      throw error
    }
  }, [getSigner, checkTokenAllowance, approveToken, fetchPositions, address])

  // Remove liquidity
  const removeLiquidity = useCallback(async (
    token0Address: string,
    token1Address: string,
    liquidity0Long: string,
    liquidity0Short: string,
    liquidity1Long: string,
    liquidity1Short: string
  ) => {
    try {
      const signer = await getSigner()
      if (!signer) throw new Error('No signer available')

      const routerAddress = getRouterAddress(ChainId.SONIC_BLAZE_TESTNET)
      if (!routerAddress) throw new Error('Router contract not deployed')
      
      const marketAddress = getMarketAddress(ChainId.SONIC_BLAZE_TESTNET)
      if (!marketAddress) throw new Error('Market contract not deployed')

      const routerContract = new ethers.Contract(routerAddress, ROUTER_ABI, signer)
      const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, signer)
      const liquidityContract = new ethers.Contract(marketAddress, LIQUIDITY_ABI, signer)
      const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      
      // Calculate poolId for LP token approval using Market ABI
      const poolId = await marketContract.getPairId(token0Address, token1Address)
      
      console.log('🔐 Approving Router to transfer LP tokens for poolId:', poolId.toString())
      
      // Approve Router to transfer LP tokens (TTL-based approval) using Liquidity ABI
      const approvalDeadline = Math.floor(Date.now() / 1000) + 7200 // 2 hours from now
      const approvalTx = await liquidityContract.approve(routerAddress, poolId, approvalDeadline)
      await approvalTx.wait()
      
      console.log('✅ LP token approval successful')

      console.log('🔄 Calling Router.removeLiquidity with:', {
        token0Address,
        token1Address,
        liquidity0Long,
        liquidity0Short,
        liquidity1Long,
        liquidity1Short,
        userAddress: address,
        deadline
      })

      // First, simulate the call to get the return values (amount0, amount1)
      console.log('🔍 Simulating removeLiquidity call to get return values...')
      const [simulatedAmount0, simulatedAmount1] = await routerContract.removeLiquidity.staticCall(
        token0Address,
        token1Address,
        ethers.parseUnits(liquidity0Long, 18), // longX - LP tokens to remove
        ethers.parseUnits(liquidity0Short, 18), // shortX
        ethers.parseUnits(liquidity1Long, 18), // longY
        ethers.parseUnits(liquidity1Short, 18), // shortY
        0n, // amount0Minimum - minimum token0 to receive
        0n, // amount1Minimum - minimum token1 to receive
        address, // to - recipient
        deadline
      )
      
      console.log('📊 Simulated return values:', {
        amount0: ethers.formatUnits(simulatedAmount0, 18),
        amount1: ethers.formatUnits(simulatedAmount1, 18)
      })

      // Now execute the actual transaction
      console.log('🚀 Executing actual removeLiquidity transaction...')
      const tx = await routerContract.removeLiquidity(
        token0Address,
        token1Address,
        ethers.parseUnits(liquidity0Long, 18), // longX - LP tokens to remove
        ethers.parseUnits(liquidity0Short, 18), // shortX
        ethers.parseUnits(liquidity1Long, 18), // longY
        ethers.parseUnits(liquidity1Short, 18), // shortY
        0n, // amount0Minimum - minimum token0 to receive
        0n, // amount1Minimum - minimum token1 to receive
        address, // to - recipient
        deadline
      )

      const receipt = await tx.wait()
      
      // Refresh positions after successful transaction
      await fetchPositions()
      
      // Return both transaction hash and the actual withdrawal amounts
      return {
        txHash: tx.hash,
        amount0: ethers.formatUnits(simulatedAmount0, 18),
        amount1: ethers.formatUnits(simulatedAmount1, 18)
      }
    } catch (error) {
      console.error('Error removing liquidity:', error)
      throw error
    }
  }, [getSigner, fetchPositions])

  // Load positions on mount and when authentication changes
  useEffect(() => {
    console.log('useLiquidity useEffect triggered:', { isConnected, address, provider, signer })
    if (isConnected && address) {
      console.log('Wallet connected, fetching positions...')
      fetchPositions()
    } else {
      console.log('Wallet not connected, clearing state...')
      // Immediately clear all state when not connected
      setLoading(false)
      setPositions([])
      setError(null)
    }
  }, [isConnected, address, fetchPositions])

  // Additional effect to immediately clear positions when wallet disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      console.log('Wallet disconnected, immediately clearing positions...')
      setPositions([])
      setLoading(false)
      setError(null)
    }
  }, [isConnected, address])

  // Manual refresh function with delay for better reliability
  const refreshPositions = useCallback(async () => {
    console.log('Manual position refresh requested...')
    setLoading(true)
    
    // Wait a bit for blockchain state to update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await fetchPositions()
    console.log('Manual position refresh completed')
  }, [fetchPositions])

  return {
    positions,
    loading,
    error,
    fetchPositions,
    refreshPositions, // New manual refresh function
    addLiquidity,
    removeLiquidity,
    getTokenInfo,
    checkTokenAllowance,
    approveToken,
    isAuthenticated: isConnected && !!address
  }
}

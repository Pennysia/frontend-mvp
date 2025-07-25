'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ChainId, getMarketAddress, getRouterAddress } from '../../../lib/sdk-utils'
import { MARKET_ABI, ROUTER_ABI, ERC20_ABI } from '../../../lib/abis'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { LiquidityPosition } from '../hooks/useLiquidity'

interface PositionOverviewProps {
    position: LiquidityPosition
}

interface LPTokenBalances {
    longX: string    // User's longX LP token balance
    shortX: string   // User's shortX LP token balance
    longY: string    // User's longY LP token balance
    shortY: string   // User's shortY LP token balance
}

export default function PositionOverview({ position }: PositionOverviewProps) {
    const [lpTokenBalances, setLpTokenBalances] = useState<LPTokenBalances | null>(null)
    const [isLoadingBalances, setIsLoadingBalances] = useState(false)
    const [tokenValues, setTokenValues] = useState<{
        longXValue: string
        shortXValue: string
        longYValue: string
        shortYValue: string
    } | null>(null)
    const [tokenNames, setTokenNames] = useState<{
        token0Name: string
        token1Name: string
    } | null>(null)
    const { user } = usePrivy()
    const { wallets } = useWallets()

    // Extract token symbols from position
    const token0Symbol = position.token0Symbol
    const token1Symbol = position.token1Symbol

    // Fetch LP token balances and calculate values
    const fetchLPTokenBalances = async () => {
        if (!user?.wallet?.address || !position) return

        setIsLoadingBalances(true)
        try {
            // Get provider using Privy v2 API
            if (!wallets[0]) throw new Error('No wallet connected')
            const ethereumProvider = await wallets[0].getEthereumProvider()
            const provider = new ethers.BrowserProvider(ethereumProvider)
            const marketAddress = getMarketAddress(ChainId.SONIC_BLAZE_TESTNET)
            const routerAddress = getRouterAddress(ChainId.SONIC_BLAZE_TESTNET)
            if (!marketAddress || !routerAddress) throw new Error('Contract addresses not found')

            const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, provider)
            const routerContract = new ethers.Contract(routerAddress, ROUTER_ABI, provider)

            // Use the pair ID from the position.id field
            const poolId = BigInt(position.id)

            // Get user's LP token balances using balanceOf(address, poolId)
            const balances = await marketContract.balanceOf(user.wallet.address, poolId)
            const [longX, shortX, longY, shortY] = balances

            // Format LP token balances with proper precision
            const formattedBalances = {
                longX: ethers.formatUnits(longX, 18),
                shortX: ethers.formatUnits(shortX, 18),
                longY: ethers.formatUnits(longY, 18),
                shortY: ethers.formatUnits(shortY, 18)
            }

            setLpTokenBalances(formattedBalances)

            // Fetch token names using ERC20 name() function
            const token0Contract = new ethers.Contract(position.token0Address, ERC20_ABI, provider)
            const token1Contract = new ethers.Contract(position.token1Address, ERC20_ABI, provider)

            const [token0Name, token1Name] = await Promise.all([
                token0Contract.name(),
                token1Contract.name()
            ])

            setTokenNames({
                token0Name,
                token1Name
            })

            // Use the token values already calculated in useLiquidity hook
            setTokenValues({
                longXValue: position.reserve0Long,
                shortXValue: position.reserve0Short,
                longYValue: position.reserve1Long,
                shortYValue: position.reserve1Short
            })
        } catch (error) {
            console.error('Error fetching LP token balances:', error)
        } finally {
            setIsLoadingBalances(false)
        }
    }

    // Fetch LP token balances when component mounts
    useEffect(() => {
        if (position) {
            fetchLPTokenBalances()
        }
    }, [position])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-600 dark:text-white mb-2">Position Overview</h2>
                <p className="text-gray-600 dark:text-gray-400 font-light text-sm">
                    Providing full range liquidity ensures continuous market participation across all possible prices.
                </p>
            </div>

            {/* Token Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Token 0 Card */}
                <div className="p-6 bg-gray-200/30 dark:bg-gray-800/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-500/50 pb-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">{token0Symbol}</span>
                            </div>
                            <div>
                                <h3 className="text-gray-600 dark:text-gray-300 font-base">{token0Symbol}</h3>
                                <p className="text-gray-400 text-xs">
                                    {isLoadingBalances ? 'Loading...' :
                                        tokenNames ?
                                            tokenNames.token0Name :
                                            'Loading...'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs font-light">Total {token0Symbol}</p>
                            <p className="text-gray-600 dark:text-gray-200 text-base font-bold">
                                {isLoadingBalances ? 'Loading...' :
                                    tokenValues ?
                                        `${(parseFloat(tokenValues.longXValue) + parseFloat(tokenValues.shortXValue)).toFixed(6)}` :
                                        'Calculating...'
                                }
                            </p>
                            <p className="text-gray-400 text-xs">$0.00</p>
                        </div>
                    </div>

                    {/* Long Position */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-green-400 font-base">Long</h4>
                        </div>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">APR:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">{position.apr}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">LP Tokens:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">
                                    {parseFloat(position.userLongX).toFixed(12)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">Value:</span>
                                <div className="text-right">
                                    <div className="text-gray-500 dark:text-gray-300 font-semibold">
                                        {isLoadingBalances ? 'Loading...' :
                                            tokenValues ?
                                                `${parseFloat(tokenValues.longXValue).toFixed(6)} ${token0Symbol}` :
                                                'Calculating...'
                                        }
                                    </div>
                                    <div className="text-gray-400 text-xs">$0.00</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Short Position */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-red-400 font-base">Short</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">APR:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">{position.apr}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">LP Tokens:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">
                                    {parseFloat(position.userShortX).toFixed(12)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-xs">Value:</span>
                                <div className="text-right">
                                    <div className="text-gray-500 dark:text-gray-300 font-semibold">
                                        {isLoadingBalances ? 'Loading...' :
                                            tokenValues ?
                                                `${parseFloat(tokenValues.shortXValue).toFixed(6)} ${token0Symbol}` :
                                                'Calculating...'
                                        }
                                    </div>
                                    <div className="text-gray-400 text-xs">$0.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Token 1 Card */}
                <div className="p-6 bg-gray-200/30 dark:bg-gray-800/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-500/50 pb-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">{token1Symbol}</span>
                            </div>
                            <div>
                                <h3 className="text-gray-600 dark:text-gray-300 font-base">{token1Symbol}</h3>
                                <p className="text-gray-400 text-xs">
                                    {isLoadingBalances ? 'Loading...' :
                                        tokenNames ?
                                            tokenNames.token1Name :
                                            'Loading...'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs font-light">Total {token1Symbol}</p>
                            <p className="text-gray-600 dark:text-gray-200 text-base font-bold">
                                {isLoadingBalances ? 'Loading...' :
                                    tokenValues ?
                                        `${(parseFloat(tokenValues.longYValue) + parseFloat(tokenValues.shortYValue)).toFixed(6)}` :
                                        'Calculating...'
                                }
                            </p>
                            <p className="text-gray-400 text-xs">$0.00</p>
                        </div>
                    </div>

                    {/* Long Position */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-green-400 font-base">Long</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-base text-xs">APR:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">{position.apr}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-base text-xs">LP Tokens:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">
                                    {parseFloat(position.userLongY).toFixed(12)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400 font-base text-xs">Value:</span>
                                <div className="text-right">
                                    <div className="text-gray-500 dark:text-gray-300 font-semibold">
                                        {isLoadingBalances ? 'Loading...' :
                                            tokenValues ?
                                                `${parseFloat(tokenValues.longYValue).toFixed(6)} ${token1Symbol}` :
                                                'Calculating...'
                                        }
                                    </div>
                                    <div className="text-gray-400 text-xs">$0.00</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Short Position */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-red-400 font-base">Short</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="dark:text-gray-400 text-gray-500 font-base text-xs">APR:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">{position.apr}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="dark:text-gray-400 text-gray-500 font-base text-xs">LP Tokens:</span>
                                <span className="text-gray-500 dark:text-gray-300 font-semibold">
                                    {parseFloat(position.userShortY).toFixed(12)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-500 font-base text-xs">Value:</span>
                                <div className="text-right">
                                    <div className="text-gray-500 dark:text-gray-300 font-semibold">
                                        {isLoadingBalances ? 'Loading...' :
                                            tokenValues ?
                                                `${parseFloat(tokenValues.shortYValue).toFixed(6)} ${token1Symbol}` :
                                                'Calculating...'
                                        }
                                    </div>
                                    <div className="text-gray-400 text-xs">$0.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

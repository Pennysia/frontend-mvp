'use client'

import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BeakerIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import HomeFooter from '@/components/HomeFooter'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--background)]">
      
      <main className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center my-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Pennysia AMM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-300">
            Experience the future of DeFi with directional liquidity positions. Take precise long or short positions while earning fees from trading activity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/swap" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span>Start Trading</span>
            </a>
            <a 
              href="/liquidity" 
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <BeakerIcon className="h-5 w-5" />
              <span>Provide Liquidity</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">$1.2M</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Volume (24h)</h3>
            <p className="text-green-500 dark:text-green-400 text-sm mt-1">+12.5% from yesterday</p>
          </div>

          <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <BeakerIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">$5.8M</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Liquidity</h3>
            <p className="text-blue-500 dark:text-blue-400 text-sm mt-1">Across 12 active pools</p>
          </div>

          <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <UserGroupIcon className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1,247</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Traders</h3>
            <p className="text-purple-500 dark:text-purple-400 text-sm mt-1">This week</p>
          </div>

          <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="h-8 w-8 text-orange-500 dark:text-orange-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">0.3%</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Protocol Fee</h3>
            <p className="text-orange-500 dark:text-orange-400 text-sm mt-1">Shared with LPs</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Activity */}
          <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'Long', pair: 'ETH/USDC', amount: '1.5 ETH', value: '$4,875', time: '2m ago', profit: true, pnl: '+$234' },
                { type: 'Short', pair: 'BTC/USDC', amount: '0.1 BTC', value: '$6,789', time: '5m ago', profit: false, pnl: '-$156' },
                { type: 'Long', pair: 'SOL/USDC', amount: '50 SOL', value: '$4,925', time: '8m ago', profit: true, pnl: '+$892' },
                { type: 'Liquidity', pair: 'ETH/USDC', amount: '2.0 ETH', value: '$6,500', time: '12m ago', profit: null, pnl: null },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-gray-800/30 rounded-lg transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'Long' ? 'bg-green-500/20' :
                      activity.type === 'Short' ? 'bg-red-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {activity.type === 'Long' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
                      ) : activity.type === 'Short' ? (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                      ) : (
                        <BeakerIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium transition-colors duration-300">{activity.pair}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{activity.amount} | {activity.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white font-medium transition-colors duration-300">{activity.value}</div>
                    {activity.profit !== null && activity.pnl && (
                      <div className={`text-sm ${
                        activity.profit ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                      } transition-colors duration-300`}>
                        {activity.pnl}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pools */}
          <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Top Liquidity Pools</h3>
            <div className="space-y-4">
              {[
                { pair: 'ETH/USDC', tvl: '$1.2M', volume: '$245K', apr: '12.5%', change: '+5.2%' },
                { pair: 'BTC/USDC', tvl: '$890K', volume: '$189K', apr: '8.7%', change: '+2.1%' },
                { pair: 'SOL/USDC', tvl: '$456K', volume: '$98K', apr: '15.2%', change: '+8.9%' },
                { pair: 'AVAX/USDC', tvl: '$234K', volume: '$45K', apr: '18.3%', change: '+12.4%' },
              ].map((pool, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium transition-colors duration-300">{pool.pair}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">TVL: {pool.tvl} | Vol: {pool.volume}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-500 dark:text-green-400 font-medium transition-colors duration-300">{pool.apr} APR</div>
                    <div className="text-green-500 dark:text-green-400 text-sm transition-colors duration-300">{pool.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Protocol Features */}
        <div className="bg-blue-50 dark:bg-blue-900/10 backdrop-blur-sm rounded-2xl border border-blue-200 dark:border-blue-500/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Choose Pennysia?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Long Positions</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Provide liquidity for upward price movements and earn fees when traders go long.</p>
              <div className="text-green-500 dark:text-green-400 font-medium">12.5% APR</div>
            </div>
            <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <BeakerIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Advanced AMM</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Innovative automated market maker with efficient pricing and minimal slippage.</p>
              <div className="text-green-500 dark:text-green-400 font-medium">8.7% APR</div>
            </div>
            <div className="bg-white/70 dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">High Yields</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Earn competitive yields through trading fees and directional position rewards.</p>
              <div className="text-green-500 dark:text-green-400 font-medium">15.2% APR</div>
            </div>
          </div>
        </div>
      </main>
      
      <HomeFooter />
    </div>
  )
}

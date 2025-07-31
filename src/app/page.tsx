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
    <div className=" min-h-screen bg-gray-50 dark:bg-[var(--background)]">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative text-center items-center flex flex-col overflow-hidden rounded-3xl">
          {/* Background SVG */}
          <div
            className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-75 dark:opacity-5"
            style={{
              backgroundImage: "url('/LandingHeroBg.svg')",
              backgroundSize: 'contain',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Content */}
          <div className="relative z-10 py-20 px-4 sm:px-8 flex flex-col items-center pt-36 md:pt-52 mb-28">
            <div className="border border-[#2E2F46]/30 dark:border-white/60 rounded-full py-2 px-4 mb-6">
              <p className="text-xs font-medium text-[#2E2F46]/50 dark:text-white">Coming Soon...</p>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[#2E2F46] dark:text-white mb-4 md:mb-8 max-w-4xl">
              Let your Crypto generate <br />
              <span className="bg-gradient-to-b from-[#2E2F46] via-[#4967DC] to-[#5B7AF6] text-transparent bg-clip-text block mt-1 md:mt-3">Infinite Passive Income.</span>
            </h1>

            <p className="text-base md:text-lg text-[#2E2F46] dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-300">
              Experience the future of DeFi with directional liquidity positions. Take precise long or short positions while earning fees from trading activity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/swap"
                className="px-8 py-3 text-white bg-[#5B7AF6] hover:bg-[#4967DC] rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowTrendingUpIcon className="h-5 w-5" />
                <span>Start Trading</span>
              </a>
              <a
                href="/liquidity"
                className="px-8 py-3 text-[#2E2F46] dark:text-white/75 bg-transparent hover:bg-[#2E2F46]/20 border border-[#2E2F46] dark:border-white/75 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <BeakerIcon className="h-5 w-5" />
                <span>Provide Liquidity</span>
              </a>
            </div>
          </div>


          {/* 3 Responsive Cards */}
          <div className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-4 sm:px-0">
            {/* Card 1 */}
            <div className="p-6 bg-white dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left">
              <div className="w-28 h-28 mx-auto my-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <div className="w-22 h-22 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
                <h3 className="pt-6 text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Lifetime Passive <br /><span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 text-transparent bg-clip-text block">Income Generator</span></h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">
                  Take precise long or short positions with directional liquidity positions
                </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left">
              <div className="w-28 h-28 mx-auto my-6 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center">
                <div className="w-22 h-22 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
              <h3 className="pt-6 text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Bidirectional <br /><span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 text-transparent bg-clip-text block">Liquidity Prediction</span></h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">
                Earn fees from trading activity while your crypto generates passive income
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left">
              <div className="w-28 h-28 mx-auto my-6 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                <div className="w-22 h-22 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
              <h3 className="pt-6 text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Decentralized and Automated <br /><span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 text-transparent bg-clip-text block">Marketplace</span></h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">
                Innovative 4-reserve architecture for enhanced liquidity and trading efficiency
              </p>
            </div>
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
                    <div className={`p-2 rounded-lg ${activity.type === 'Long' ? 'bg-green-500/20' :
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
                      <div className={`text-sm ${activity.profit ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
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


      </main>

      <HomeFooter />
    </div>
  )
}

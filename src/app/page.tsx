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
            className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat opacity-100 dark:opacity-5"
            style={{
              backgroundImage: "url('/LandingHeroBg.svg')",
              backgroundSize: 'contain',
              backgroundPosition: 'top center',
              backgroundRepeat: 'no-repeat',
              imageRendering: 'crisp-edges'
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




      </main>

      <HomeFooter />
    </div>
  )
}

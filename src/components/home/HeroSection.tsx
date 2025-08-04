'use client'

import React from 'react'
import { ArrowTrendingUpIcon, BeakerIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  return (
    <div className="relative text-center items-center flex flex-col overflow-hidden rounded-3xl md:h-[100vh] md:max-h-[1000px]">
      {/* Background SVG */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat opacity-100 dark:opacity-5"
        style={{
          backgroundImage: "url('/LandingHeroBg.svg')",
          backgroundSize: "contain",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          imageRendering: "-webkit-optimize-contrast"
        }}
      />

      {/* Content */}
      <div className="relative z-10 pb-0 px-4 sm:px-8 flex flex-col items-center pt-32 md:pt-0 md:h-full md:items-center md:justify-center mb-28">
        <div className="border border-[#2E2F46]/30 dark:border-white/60 rounded-full py-2 px-4 mb-6">
          <p className="text-xs font-medium text-[#2E2F46]/50 dark:text-white">
            Coming Soon...
          </p>
        </div>

        <h1 className="text-3xl md:text-6xl font-semibold text-[#2E2F46] dark:text-white mb-4 md:mb-8 max-w-4xl">
          Turn your Crypto into <br />
          <span className="bg-gradient-to-b from-[#2E2F46] via-[#4967DC] to-[#5B7AF6] text-transparent bg-clip-text block mt-1 md:mt-3">
            Infinite Passive Income.
          </span>
        </h1>

        <p className="text-base md:text-lg text-[#2E2F46] dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-300">
          The first AMM where you can profit from both sides of every trade. Provide liquidity in long/short and start earning. Your liquidity, your conviction, your rewards.
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
    </div>
  )
}

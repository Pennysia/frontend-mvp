"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BeakerIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import HomeFooter from "@/components/HomeFooter";

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
              backgroundSize: "contain",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
              imageRendering: "crisp-edges",
            }}
          />

          {/* Content */}
          <div className="relative z-10 py-20 px-4 sm:px-8 flex flex-col items-center pt-36 md:pt-52 mb-28">
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
              The first DEX where you can profit from both sides of every trade. Provide liquidity in long/short and start earning. Your liquidity, your conviction, your rewards.
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
          <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4 sm:px-0">
            {/* Card 1 */}
            <div className="p-6 bg-white dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left">
              <div className="w-full h-auto mx-auto my-2 flex items-center justify-center">
                <Image
                  src="/pennysia-brandkit/svg/full-logo/h1.svg"
                  alt="Pennysia Logo"
                  width={381}
                  height={315}
                  className="object-cover w-full h-auto"
                  priority
                  quality={100}
                />
              </div>
              <h3 className="pt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                Lifetime Passive <br />
                <span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 text-transparent bg-clip-text block">
                  Income Generator
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base transition-colors duration-300">
                Take precise long or short positions with directional liquidity
                positions
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left">
              <div className="w-full h-auto mx-auto my-2 flex items-center justify-center">
                <Image
                  src="/pennysia-brandkit/svg/full-logo/h2.svg"
                  alt="Pennysia Logo"
                  width={280}
                  height={280}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
              <h3 className="pt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                Bidirectional <br />
                <span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 text-transparent bg-clip-text block">
                  Liquidity Prediction
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base transition-colors duration-300">
                Earn fees from trading activity while your crypto generates
                passive income
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white dark:bg-[var(--background)]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left">
              <div className="w-full h-auto mx-auto my-2 flex items-center justify-center">
                <Image
                  src="/pennysia-brandkit/svg/full-logo/h3.svg"
                  alt="Pennysia Logo"
                  width={280}
                  height={280}
                  className="object-cover w-full h-auto"
                  priority
                  quality={100}
                />
              </div>
              <h3 className="pt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                Decentralized and <br />
                <span className="bg-gradient-to-b from-[#2E2F46]  to-[#2E2F46]/50 text-transparent bg-clip-text block">
                  Automated Marketplace
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base transition-colors duration-300">
                Innovative 4-reserve architecture for enhanced liquidity and
                trading efficiency
              </p>
            </div>
          </div>

          {/* 3 Zigzag Decorative Elements */}
          <div className="relative w-full max-w-7xl mx-auto mt-16 mb-8">
            {/* Zigzag 1 */}
            <svg
              className="absolute -top-4 left-0 w-full h-8 opacity-20"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,20 L50,10 L100,30 L150,10 L200,30 L250,10 L300,30 L350,10 L400,30 L450,10 L500,30 L550,10 L600,30 L650,10 L700,30 L750,10 L800,30 L850,10 L900,30 L950,10 L1000,30 L1050,10 L1100,30 L1150,10 L1200,30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-blue-500 dark:text-blue-400"
              />
            </svg>

            {/* Zigzag 2 */}
            <svg
              className="absolute -top-8 left-0 w-full h-8 opacity-15"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,25 L60,15 L120,35 L180,15 L240,35 L300,15 L360,35 L420,15 L480,35 L540,15 L600,35 L660,15 L720,35 L780,15 L840,35 L900,15 L960,35 L1020,15 L1080,35 L1140,15 L1200,35"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-purple-500 dark:text-purple-400"
              />
            </svg>

            {/* Zigzag 3 */}
            <svg
              className="absolute -top-12 left-0 w-full h-8 opacity-10"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,30 L70,20 L140,40 L210,20 L280,40 L350,20 L420,40 L490,20 L560,40 L630,20 L700,40 L770,20 L840,40 L910,20 L980,40 L1050,20 L1120,40 L1200,40"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-green-500 dark:text-green-400"
              />
            </svg>
          </div>

          {/* Leverage Our Technology Section */}
          <div className="max-w-7xl mx-auto mt-24 mb-16 px-4 sm:px-0">
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#2E2F46] dark:text-white mb-36">
              Built to leverage your on-chain strategy.
            </h2>

            <div className="space-y-6 pb-12">
              {/* Trade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-top bg-gray-200/50 dark:bg-[#555C6F]/20 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                <div className="flex flex-col h-full w-full text-left relative">
                  <div className="w-fit flex items-center flex-row bg-gray-200 dark:bg-[#555C6F]/10 rounded-xl py-2 px-2 mb-4">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    <p className="text-xs font-medium text-blue-400 px-2">
                      TRADE TOKENS
                    </p>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-normal text-[#2E2F46] dark:text-white mb-3">
                    Guaranteed liquidity and constant fees.
                  </h3>
                  {/* <p className="text-gray-600 dark:text-gray-400 mb-4 text-base">
                    Execute precise directional trades with our advanced AMM. Take long or short positions 
                    with optimal price execution and minimal slippage across all supported pairs.
                  </p> */}
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Multi-hop routing for best prices</li>
                    <li>• Directional position support</li>
                    <li>• 0.3% fixed fee structure</li>
                  </ul>
                  <Link
                    href="/swap"
                    className="text-white dark:text-[#19192A] text-sm inline-flex items-center w-fit mt-6 hover:bg-[#A7ADBB] bg-[#19192A] dark:bg-[#E7E8EB] border border-[#555C6F] font-normal py-3 px-6 rounded-full transition-all duration-200 relative z-10"
                  >
                    Swap now
                  </Link>
                </div>
                <div className="flex justify-center md:justify-start pointer-events-none ">
                  <div className="w-144 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </div>
                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-top">
                {/* Provide Liquidity */}
                <div className="flex flex-col h-full w-full text-left relative gap-12 items-top bg-gray-200/50 dark:bg-[#555C6F]/20 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col h-full w-full text-left relative">
                    <div className="w-fit flex items-center flex-row bg-gray-200 dark:bg-[#555C6F]/10 rounded-xl py-2 px-2 mb-4">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs font-medium text-green-600 px-2">
                        PROVIDE LIQUIDITY
                      </p>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-normal text-[#2E2F46] dark:text-white mb-3">
                      Separate liquidity into{" "}
                      <span className="text-green-600 dark:text-green-400">
                        Long
                      </span>{" "}
                      and{" "}
                      <span className="text-red-600 dark:text-red-400">
                        Short{" "}
                      </span>
                      positions.
                    </h3>
                    {/* <p className="text-gray-600 dark:text-gray-400 mt-2 mb-2">
                    Earn passive income by providing liquidity to our directional pools. Support both bullish 
                    and bearish positions while earning trading fees from all activity.
                  </p> */}
                    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <li>• 4-reserve system architecture</li>
                      <li>• Long/short position support</li>
                      <li>• Automatic fee distribution</li>
                    </ul>
                    <Link
                      href="/liquidity"
                      className="text-[#19192A] text-sm dark:text-white inline-flex items-center w-fit mt-6 hover:bg-[#A7ADBB] bg-transparent border border-[#555C6F] font-normal py-3 px-6 rounded-full transition-all duration-200 relative z-10"
                    >
                      Go to Liquidity
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="flex justify-center md:justify-start pointer-events-none">
                    <div className="w-128 h-84 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* Use Oracle */}
                <div className="flex flex-col h-full w-full text-left relative gap-12 items-top bg-gray-200/50 dark:bg-[#555C6F]/20 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col h-full w-full text-left relative">
                  <div className="w-fit flex items-center flex-row bg-gray-200 dark:bg-[#555C6F]/10 rounded-xl py-2 px-2 mb-4">
                    <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4.05 11.05l-.707.707m2.122 6.364l-.707.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1m14.95-1.05l.707-.707m-2.122-6.364l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                      />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                        />
                    </svg>
                    <p className="text-xs font-medium text-purple-400 px-2">
                      TWAP PRICE ORACLE
                    </p>
                  </div>
                    <h3 className="text-3xl md:text-4xl font-normal text-[#2E2F46] dark:text-white mb-3">
                      Integrate our resilient price oracle.
                    </h3>
                    {/* <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Access real-time price feeds and market data through our integrated oracle system. 
                    Make informed decisions with accurate, up-to-date information for all trading pairs.
                  </p> */}
                    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <li>• Real-time price feeds</li>
                      <li>• Multi-source data aggregation</li>
                      <li>• Decentralized oracle network</li>
                    </ul>
                    <Link
                      href="https://docs.pennysia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#19192A] text-sm dark:text-white inline-flex items-center w-fit mt-6 hover:bg-[#A7ADBB] bg-transparent border border-[#555C6F] font-normal py-3 px-6 rounded-full transition-all duration-200 relative z-10"
                    >
                      Learn more
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                  <div className="flex justify-center md:justify-start pointer-events-none">
                    <div className="w-128 h-84 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4.05 11.05l-.707.707m2.122 6.364l-.707.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1m14.95-1.05l.707-.707m-2.122-6.364l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                        />
                      </svg>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 3 Zigzag Decorative Elements */}
            <div className="relative w-full max-w-7xl mx-auto mt-24 mb-8">
              {/* Zigzag 1 */}
              <svg
                className="absolute -top-4 left-0 w-full h-8 opacity-20"
                viewBox="0 0 1200 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,20 L50,10 L100,30 L150,10 L200,30 L250,10 L300,30 L350,10 L400,30 L450,10 L500,30 L550,10 L600,30 L650,10 L700,30 L750,10 L800,30 L850,10 L900,30 L950,10 L1000,30 L1050,10 L1100,30 L1150,10 L1200,30"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-blue-500 dark:text-blue-400"
                />
              </svg>

              {/* Zigzag 2 */}
              <svg
                className="absolute -top-8 left-0 w-full h-8 opacity-15"
                viewBox="0 0 1200 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,25 L60,15 L120,35 L180,15 L240,35 L300,15 L360,35 L420,15 L480,35 L540,15 L600,35 L660,15 L720,35 L780,15 L840,35 L900,15 L960,35 L1020,15 L1080,35 L1140,15 L1200,35"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  className="text-purple-500 dark:text-purple-400"
                />
              </svg>

              {/* Zigzag 3 */}
              <svg
                className="absolute -top-12 left-0 w-full h-8 opacity-10"
                viewBox="0 0 1200 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,30 L70,20 L140,40 L210,20 L280,40 L350,20 L420,40 L490,20 L560,40 L630,20 L700,40 L770,20 L840,40 L910,20 L980,40 L1050,20 L1120,40 L1200,40"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-green-500 dark:text-green-400"
                />
              </svg>
            </div>


            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mt-48 mb-24 px-4 sm:px-0">
              <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#2E2F46] dark:text-white mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <details className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-[#2E2F46] dark:text-white">
                      What is directional liquidity?
                    </h3>
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                    Directional liquidity allows you to provide liquidity with a specific market bias - either long (bullish) or short (bearish) positions. This innovative approach lets you earn trading fees while maintaining your market outlook.
                  </div>
                </details>

                {/* FAQ Item 2 */}
                <details className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-[#2E2F46] dark:text-white">
                      How do I earn passive income?
                    </h3>
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                    By providing liquidity to our directional pools, you earn a portion of trading fees from every transaction. Our 4-reserve system ensures optimal fee distribution based on your position type and market activity.
                  </div>
                </details>

                {/* FAQ Item 3 */}
                <details className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-[#2E2F46] dark:text-white">
                      Is my investment safe?
                    </h3>
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                    We use audited smart contracts and a decentralized architecture. Your funds remain in your control at all times, and you can withdraw liquidity whenever you choose. All transactions are transparent and verifiable on-chain.
                  </div>
                </details>

                {/* FAQ Item 4 */}
                <details className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-[#2E2F46] dark:text-white">
                      What are the fees?
                    </h3>
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                    We charge a fixed 0.3% trading fee. 80% of fees go to liquidity providers, while 20% supports protocol development. There are no hidden fees or surprise charges.
                  </div>
                </details>
              </div>
            </div>


            {/* Your Money, Your Decision Card */}
            <div className="max-w-6xl mx-auto mt-24 mt-36 mb-24 px-4 sm:px-0">
              <div className="bg-gradient-to-br from-[#5B7AF6]/20 via-[#4967DC]/20 to-[#2E2F46]/20 dark:from-[#5B7AF6]/30 dark:via-[#4967DC]/30 dark:to-[#2E2F46]/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-[#5B7AF6]/30 dark:border-[#5B7AF6]/40">
                <h3 className="text-2xl md:text-3xl font-semibold text-[#2E2F46] dark:text-white mb-4 text-center">
                  Start Building Your Future
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                  Take full control of your financial future with transparent, decentralized trading.
                  Access comprehensive documentation or request custom integrations tailored to your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/docs"
                    className="inline-flex items-center bg-[#5B7AF6] hover:bg-[#555C6F] text-white font-medium py-3 px-8 rounded-lg transition-all duration-200"
                  >
                    Read Doc
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center border border-[#5B7AF6]/30 text-[#5B7AF6] dark:text-white hover:bg-[#5B7AF6]/10 dark:hover:bg-[#5B7AF6]/20 font-medium py-3 px-8 rounded-lg transition-all duration-200"
                  >
                    Request
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}

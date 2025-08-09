'use client'

import React from 'react'

export default function ZigzagDecorator() {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-16">
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
  )
}

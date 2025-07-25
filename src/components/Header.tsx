'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bars3Icon
} from '@heroicons/react/24/outline'
import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'
import PrivyWalletButton from './PrivyWalletButton'
import clsx from 'clsx'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 dark:bg-[var(--background)]/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pennysia
                </h1>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Privy Wallet Button */}
            <PrivyWalletButton />
          </div>
        </div>


      </div>
    </header>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    <header className="fixed top-4 left-0 right-0 z-50 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-[var(--background)]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-xl shadow-md ">
          <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center h-full">
              <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
                <div className="relative h-full flex items-center">
                  <Image
                    src="/pennysia-brandkit/svg/full-logo/full-light-transparent.svg"
                    alt="Pennysia"
                    width={120}
                    height={32}
                    className="block dark:hidden"
                    priority
                  />
                  <Image
                    src="/pennysia-brandkit/svg/full-logo/full-dark-transparent.svg"
                    alt="Pennysia"
                    width={120}
                    height={32}
                    className="hidden dark:block"
                    priority
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block mx-8">
            <Navigation />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Privy Wallet Button */}
            <PrivyWalletButton />
          </div>
        </div>
      </div>
    </div>
  </header>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'
import PrivyWalletButton from './PrivyWalletButton'
// Logo paths are handled as static assets

export default function Header() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-[var(--background)]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-xl shadow-md ">
          <div className="flex justify-between items-center h-16 pr-2">
            {/* Logo */}
              <Link href="/" className="hover:opacity-80 transition-opacity flex items-center h-16 w-fit">
                  <Image
                    src="/pennysia-brandkit/svg/icon/main-light-transparent.svg"
                    alt="Pennysia logo light"
                    width={500}
                    height={500}
                    className="block dark:hidden"
                    style={{ objectFit: "cover", width: "64px", height: "64px" }}
                    priority={true}
                    quality={100}
                  />
                  <img src="/pennysia-brandkit/svg/icon/main-light-transparent.svg" alt="Pennysia logo light" className="block dark:hidden max-w-20" />
                  <Image
                    src="/pennysia-brandkit/svg/icon/main-dark-transparent.svg"
                    alt="Pennysia logo dark"
                    width={500}
                    height={500}
                    className="hidden dark:block"
                    style={{ objectFit: "cover", width: "64px", height: "64px" }}
                    priority={true}
                    quality={100}
                  />
              </Link>

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

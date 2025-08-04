'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ArrowsRightLeftIcon, 
  BeakerIcon, 
  ChartBarIcon,
  WalletIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import {
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  BeakerIcon as BeakerIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  WalletIcon as WalletIconSolid,
  HomeIcon as HomeIconSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const navigation = [
  { 
    name: 'Home', 
    href: '/', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    description: 'Welcome to Pennysia'
  },
  // { 
  //   name: 'Market', 
  //   href: '/market', 
  //   icon: ChartBarIcon, 
  //   iconSolid: ChartBarIconSolid,
  //   description: 'Protocol metrics and insights'
  // },
  { 
    name: 'Swap', 
    href: '/swap', 
    icon: ArrowsRightLeftIcon, 
    iconSolid: ArrowsRightLeftIconSolid,
    description: 'Trade tokens with directional positions'
  },
  { 
    name: 'Liquidity', 
    href: '/liquidity', 
    icon: BeakerIcon, 
    iconSolid: BeakerIconSolid,
    description: 'Provide liquidity and manage your portfolio'
  }
]

interface NavigationProps {
  className?: string
}

function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={clsx('flex space-x-4', className)}>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = isActive ? item.iconSolid : item.icon
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                : 'text-gray-600 dark:text-gray-200 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/50'
            )}
            title={item.description}
          >
            <span className="hidden sm:block">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

// Mobile Navigation Component
export function MobileNavigation({ className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={clsx('mx-auto px-4 sm:px-6 lg:px-8 flex justify-around space-x-1', className)}>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = isActive ? item.iconSolid : item.icon
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'w-full flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
            title={item.description}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default React.memo(Navigation)

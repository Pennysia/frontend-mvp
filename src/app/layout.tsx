import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import PrivyWrapper from '@/contexts/PrivyProvider'
import AuthBridge from '@/components/AuthBridge'
import Header from '@/components/Header'
import BottomNavigation from '@/components/BottomNavigation'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pennysia AMM - Directional Liquidity Trading",
  description: "Trade with directional liquidity positions on Pennysia AMM. Long and short positions with advanced AMM mechanics.",
  keywords: "DeFi, AMM, DEX, Directional Liquidity, Trading, Ethereum, Sonic",
  authors: [{ name: "Pennysia Team" }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <PrivyWrapper>
            <AuthBridge />
            <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
              <Header key="header" />
              <main key="main" className="bg-gray-50 dark:bg-[var(--background)]">
                {children}
              </main>
              <BottomNavigation key="bottom-nav" />
            </div>
          </PrivyWrapper>
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-gray-800 dark:text-white bg-white text-gray-900 dark:border-gray-700 border-gray-200',
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

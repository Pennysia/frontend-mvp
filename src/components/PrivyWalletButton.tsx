'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDownIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function PrivyWalletButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <button 
        disabled
        className="flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
      >
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Loading...</span>
      </button>
    );
  }

  // If user is authenticated, show dropdown with wallet info
  if (authenticated && wallets.length > 0) {
    const wallet = wallets[0]; // Use the first connected wallet
    const address = wallet.address;
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-900/30"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Connected</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900  rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* Address with copy button */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Wallet Address</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{shortAddress}</p>
                </div>
                <button
                  onClick={() => copyAddress(address)}
                  className="ml-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                  title="Copy address"
                >
                  {isCopied ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Disconnect button */}
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium text-sm"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If user is not authenticated, show connect button
  return (
    <button
      onClick={login}
      className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-[#19192A] hover:bg-[#555C6F] dark:bg-[#19192A] dark:hover:bg-[#555C6F] text-white rounded-lg transition-all duration-200 font-medium"
    >
      <svg className="h-6 w-6 hidden sm:block" viewBox="0 0 24 24" fill="none">
        {/* Main wallet body */}
        <rect x="2" y="6" width="20" height="12" rx="3" ry="3" fill="white"/>
        {/* Card slot opening */}
        <rect x="15" y="11" width="6" height="4" rx="1" ry="1" fill="black" stroke="white" strokeWidth="1"/>
        {/* Card detail inside slot */}
        <rect x="15" y="11" width="6" height="4" rx="1" ry="1" fill="black"/>
        {/* Wallet button/clasp */}
        <circle cx="18" cy="13" r="1" fill="red"/>
        {/* Wallet fold line */}
        <path d="M2 9 L22 9" stroke="black" strokeWidth="1" opacity="1"/>
      </svg>
      <span>Connect</span>
    </button>
  );
}

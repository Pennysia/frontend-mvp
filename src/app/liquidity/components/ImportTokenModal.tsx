'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useScrollLock } from '../hooks/useScrollLock'
import TokenSelector from './TokenSelector'
import { useLiquidity } from '../hooks/useLiquidity'
import { type Token } from '../services/tokenService'
import toast from 'react-hot-toast'

interface ImportPositionModalProps {
  isOpen: boolean
  onClose: () => void
  onPositionImported?: () => Promise<void>
}

export default function ImportPositionModal({ isOpen, onClose, onPositionImported }: ImportPositionModalProps) {
  const [selectedTokenA, setSelectedTokenA] = useState<Token | null>(null)
  const [selectedTokenB, setSelectedTokenB] = useState<Token | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  
  const { fetchPositions } = useLiquidity()
  
  // Lock background scroll when modal is open
  useScrollLock(isOpen)
  
  if (!isOpen) return null

  // Reset state when modal opens
  const handleModalOpen = () => {
    if (isOpen) {
      setSelectedTokenA(null)
      setSelectedTokenB(null)
      setIsImporting(false)
    }
  }

  // Token sorting logic to ensure token0 < token1 (same as AddLiquidityModal)
  const sortTokens = (tokenA: Token, tokenB: Token): [Token, Token] => {
    return tokenA.address.toLowerCase() < tokenB.address.toLowerCase() 
      ? [tokenA, tokenB] 
      : [tokenB, tokenA]
  }

  const handleTokenASelection = (token: Token | null) => {
    if (!token) {
      setSelectedTokenA(null)
      return
    }

    // Prevent selecting the same token
    if (selectedTokenB && token.address.toLowerCase() === selectedTokenB.address.toLowerCase()) {
      toast.error('Cannot select the same token for both positions')
      return
    }

    setSelectedTokenA(token)

    // Auto-sort tokens if both are selected
    if (selectedTokenB) {
      const [token0, token1] = sortTokens(token, selectedTokenB)
      setSelectedTokenA(token0)
      setSelectedTokenB(token1)
    }
  }

  const handleTokenBSelection = (token: Token | null) => {
    if (!token) {
      setSelectedTokenB(null)
      return
    }

    // Prevent selecting the same token
    if (selectedTokenA && token.address.toLowerCase() === selectedTokenA.address.toLowerCase()) {
      toast.error('Cannot select the same token for both positions')
      return
    }

    setSelectedTokenB(token)

    // Auto-sort tokens if both are selected
    if (selectedTokenA) {
      const [token0, token1] = sortTokens(selectedTokenA, token)
      setSelectedTokenA(token0)
      setSelectedTokenB(token1)
    }
  }

  const handleImportPosition = async () => {
    if (!selectedTokenA || !selectedTokenB) {
      toast.error('Please select both tokens')
      return
    }

    setIsImporting(true)
    
    try {
      console.log('🔍 Importing position for pair:', selectedTokenA.symbol, '/', selectedTokenB.symbol)
      
      // Refresh positions to fetch the specific pair
      await fetchPositions()
      
      // Call the callback to refresh main page positions
      if (onPositionImported) {
        await onPositionImported()
      }
      
      toast.success(`Position imported for ${selectedTokenA.symbol}/${selectedTokenB.symbol}`)
      onClose()
    } catch (error) {
      console.error('Error importing position:', error)
      toast.error('Failed to import position')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Import Position</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <p className="text-gray-400 mb-8">
            Select a token pair to import your existing liquidity position.
          </p>
          
          <div className="space-y-4 mb-8">
            {/* First Token Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Token
              </label>
              <TokenSelector
                value={selectedTokenA}
                onChange={handleTokenASelection}
                placeholder="Select first token"
                excludeToken={selectedTokenB}
              />
            </div>
            
            {/* Second Token Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Second Token
              </label>
              <TokenSelector
                value={selectedTokenB}
                onChange={handleTokenBSelection}
                placeholder="Select second token"
                excludeToken={selectedTokenA}
              />
            </div>
          </div>
          
          {/* Import Button */}
          <button 
            onClick={handleImportPosition}
            disabled={!selectedTokenA || !selectedTokenB || isImporting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Importing Position...
              </>
            ) : (
              'Import Position'
            )}
          </button>
          
          {/* Help Text */}
          {selectedTokenA && selectedTokenB && (
            <p className="text-gray-400 text-sm text-center mt-4">
              Importing position for {selectedTokenA.symbol}/{selectedTokenB.symbol}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

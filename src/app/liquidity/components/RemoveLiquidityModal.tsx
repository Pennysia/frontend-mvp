'use client'

import { useState } from 'react'
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useLiquidity, LiquidityPosition } from '../hooks/useLiquidity'
import { useLiquidityActions } from '../hooks/useLiquidityActions'
import { useScrollLock } from '../hooks/useScrollLock'
import TransactionLoadingOverlay from '../../../components/ui/TransactionLoadingOverlay'
import toast from 'react-hot-toast'

interface RemoveLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
  position?: LiquidityPosition | null
  onAddLiquidity?: () => void
  onTransactionComplete?: () => Promise<void>
}

interface WithdrawalAmount {
  percentage: number
  amount: string
  usePercentage: boolean
}

export default function RemoveLiquidityModal({ isOpen, onClose, position, onAddLiquidity, onTransactionComplete }: RemoveLiquidityModalProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [withdrawalMode, setWithdrawalMode] = useState<'percentage' | 'amount'>('percentage')

  // Individual withdrawal amounts for each LP token type
  const [token0Long, setToken0Long] = useState<WithdrawalAmount>({ percentage: 0, amount: '0', usePercentage: true })
  const [token0Short, setToken0Short] = useState<WithdrawalAmount>({ percentage: 0, amount: '0', usePercentage: true })
  const [token1Long, setToken1Long] = useState<WithdrawalAmount>({ percentage: 0, amount: '0', usePercentage: true })
  const [token1Short, setToken1Short] = useState<WithdrawalAmount>({ percentage: 0, amount: '0', usePercentage: true })

  const { performRemoveLiquidity } = useLiquidityActions()
  const { isAuthenticated } = useLiquidity()

  // Lock background scroll when modal is open
  useScrollLock(isOpen)

  // Calculate withdrawal amount based on percentage or absolute amount
  const calculateWithdrawalAmount = (withdrawal: WithdrawalAmount, maxAmount: string): string => {
    if (withdrawal.usePercentage) {
      const max = parseFloat(maxAmount)
      const amount = (max * withdrawal.percentage) / 100
      return amount.toString()
    } else {
      return withdrawal.amount
    }
  }

  // Handle liquidity removal
  const handleRemoveLiquidity = async () => {
    if (!isAuthenticated || !position) {
      toast.error('Please connect your wallet')
      return
    }

    // Calculate actual LP token withdrawal amounts (not underlying token amounts)
    const liquidity0Long = calculateWithdrawalAmount(token0Long, position.userLongX)
    const liquidity0Short = calculateWithdrawalAmount(token0Short, position.userShortX)
    const liquidity1Long = calculateWithdrawalAmount(token1Long, position.userLongY)
    const liquidity1Short = calculateWithdrawalAmount(token1Short, position.userShortY)

    // Check if any amount is being withdrawn
    const totalWithdrawal = parseFloat(liquidity0Long) + parseFloat(liquidity0Short) + parseFloat(liquidity1Long) + parseFloat(liquidity1Short)
    if (totalWithdrawal === 0) {
      toast.error('Please specify amounts to withdraw')
      return
    }

    setIsRemoving(true)

    try {
      await performRemoveLiquidity(
        {
          token0Address: position.token0Address,
          token1Address: position.token1Address,
          liquidity0Long,
          liquidity0Short,
          liquidity1Long,
          liquidity1Short
        },
        async () => {
          // Close modal and refresh main page positions
          onClose()
          if (onTransactionComplete) {
            await onTransactionComplete()
          }
        }
      )
    } catch (error) {
      console.error('Error removing liquidity:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove liquidity')
    } finally {
      setIsRemoving(false)
    }
  }

  // Helper function to set percentage for all tokens
  const setAllPercentages = (percentage: number) => {
    setToken0Long(prev => ({ ...prev, percentage, usePercentage: true }))
    setToken0Short(prev => ({ ...prev, percentage, usePercentage: true }))
    setToken1Long(prev => ({ ...prev, percentage, usePercentage: true }))
    setToken1Short(prev => ({ ...prev, percentage, usePercentage: true }))
  }

  // Early return after all hooks
  if (!isOpen || !position) return null

  // Component for individual token withdrawal control
  const TokenWithdrawalControl = ({
    tokenSymbol,
    positionType,
    maxAmount,
    withdrawal,
    setWithdrawal,
    color
  }: {
    tokenSymbol: string
    positionType: 'Long' | 'Short'
    maxAmount: string
    withdrawal: WithdrawalAmount
    setWithdrawal: (withdrawal: WithdrawalAmount) => void
    color: string
  }) => {
    const handlePercentageChange = (percentage: number) => {
      setWithdrawal({ ...withdrawal, percentage, usePercentage: true })
    }

    const handleAmountChange = (amount: string) => {
      setWithdrawal({ ...withdrawal, amount, usePercentage: false })
    }

    const maxAmountNum = parseFloat(maxAmount)
    const currentAmount = withdrawal.usePercentage
      ? (maxAmountNum * withdrawal.percentage / 100).toFixed(6)
      : withdrawal.amount

    return (
      <div className="rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-start space-x-2 ">
            <span className={`text-xs font-normal ${
              positionType === 'Long' ? 'text-green-500' : 'text-red-500'
            }`}>
              {positionType}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {tokenSymbol}
            </span>
          </div>
          <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400 items-end">
            <p className="text-xs font-light">Available:</p>
            <p>{parseFloat(maxAmount).toFixed(6)}</p>
          </div>
        </div>

        {/* Percentage Controls */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Percentage</label>
            <span className="text-sm text-gray-600 dark:text-gray-400">{withdrawal.percentage}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={withdrawal.percentage}
              onChange={(e) => handlePercentageChange(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${withdrawal.percentage}%, #d1d5db ${withdrawal.percentage}%, #d1d5db 100%)`
              }}
            />
          </div>
          <div className="flex justify-between mt-2 space-x-1">
            {[25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                onClick={() => handlePercentageChange(percent)}
                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            value={withdrawal.usePercentage ? currentAmount : withdrawal.amount}
            onChange={(e) => handleAmountChange(e.target.value)}

            max={maxAmount}
            min="0"
            step="0.000001"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0.000000"
            autoComplete="off"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:pb-0">
      <div className="bg-white dark:bg-[var(--background)] rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto relative p-4">
        {/* Loading Overlay */}
        <TransactionLoadingOverlay
          isVisible={isRemoving}
          title="Removing Liquidity..."
          subtitle="Please confirm the transactions in your wallet"
        />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Withdraw Liquidity</h2>
              <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                Withdraw your liquidity position for {position.token0Symbol}/{position.token1Symbol}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="flex space-x-2">
              {[25, 50, 75, 100].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setAllPercentages(percent)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                >
                  {percent}% All
                </button>
              ))}
            </div>
          </div>

          {/* Individual Token Controls */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdraw by Token Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Token 0 Long */}
              <div className="bg-gray-200/30 dark:bg-gray-800/30 rounded-lg p-4">
                <TokenWithdrawalControl
                  tokenSymbol={position.token0Symbol}
                  positionType="Long"
                  maxAmount={position.userLongX}
                  withdrawal={token0Long}
                  setWithdrawal={setToken0Long}
                  color="bg-green-500"
                />

                {/* Token 0 Short */}
                <TokenWithdrawalControl
                  tokenSymbol={position.token0Symbol}
                  positionType="Short"
                  maxAmount={position.userShortX}
                  withdrawal={token0Short}
                  setWithdrawal={setToken0Short}
                  color="bg-red-500"
                />
              </div>

              <div className="bg-gray-200/30 dark:bg-gray-800/30 rounded-lg p-4">
                {/* Token 1 Long */}
                <TokenWithdrawalControl
                  tokenSymbol={position.token1Symbol}
                  positionType="Long"
                  maxAmount={position.userLongY}
                  withdrawal={token1Long}
                  setWithdrawal={setToken1Long}
                  color="bg-green-500"
                />

                {/* Token 1 Short */}
                <TokenWithdrawalControl
                  tokenSymbol={position.token1Symbol}
                  positionType="Short"
                  maxAmount={position.userShortY}
                  withdrawal={token1Short}
                  setWithdrawal={setToken1Short}
                  color="bg-red-500"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">i</span>
              </div>
              <div>
                <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-1">Withdrawal Summary</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  You can withdraw specific amounts from each LP token type (Long/Short positions for each token). Use percentage sliders or enter exact amounts.
                </p>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-4 px-6 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveLiquidity}
              disabled={isRemoving}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-colors"
            >
              {isRemoving ? 'Removing Liquidity...' : 'Confirm Removal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

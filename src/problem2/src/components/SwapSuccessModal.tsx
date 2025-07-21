import { CheckCircle, Copy, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { SwapResult } from '../types/swap'

interface SwapSuccessModalProps {
  swapResult: SwapResult
  onClose: () => void
}

const SwapSuccessModal = ({ swapResult, onClose }: SwapSuccessModalProps) => {
  const [copiedTxId, setCopiedTxId] = useState(false)

  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(swapResult.transactionId)
      setCopiedTxId(true)
      setTimeout(() => setCopiedTxId(false), 2000)
    } catch (error) {
      console.error('Failed to copy transaction ID:', error)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Swap Successful!</h2>
          <p className="text-gray-600">Your transaction has been completed</p>
        </div>

        <div className="space-y-4">
          {/* Swap Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-900">
                {swapResult.fromAmount} {swapResult.fromCurrency}
              </span>
              <span className="text-gray-500">→</span>
              <span className="text-lg font-semibold text-green-600">
                {swapResult.toAmount.toFixed(6)} {swapResult.toCurrency}
              </span>
            </div>
            <div className="text-center text-sm text-gray-500">
              Total Value: ${swapResult.totalValueUSD.toFixed(2)} USD
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Exchange Rate</span>
              <span className="text-sm font-medium">
                1 {swapResult.fromCurrency} = {swapResult.exchangeRate.toFixed(6)} {swapResult.toCurrency}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transaction Time</span>
              <span className="text-sm font-medium">
                {formatDate(swapResult.timestamp)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transaction ID</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {swapResult.transactionId}
                </span>
                <button
                  onClick={copyTransactionId}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Copy Transaction ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {copiedTxId && (
              <div className="text-center text-sm text-green-600 font-medium">
                Transaction ID copied to clipboard!
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Trading
            </Button>
            <button
              onClick={() => window.open(`#/transaction/${swapResult.transactionId}`, '_blank')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="View Transaction Details"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapSuccessModal
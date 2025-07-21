import { useState } from 'react'
import { Button } from '@/components/ui/button'
import CurrencyInput from './CurrencyInput'
import ExchangeRate from './ExchangeRate'
import SwapButton from './SwapButton'
import { useSwapLogic } from '../hooks/useSwapLogic'
import type { SwapResult } from '../types/swap'

interface CurrencySwapFormProps {
  onSwapStart?: () => void
  onSwapSuccess?: (result: SwapResult) => void
  onSwapError?: (error: Error) => void
  isSwapping?: boolean
}

const CurrencySwapForm = ({ onSwapStart, onSwapSuccess, onSwapError, isSwapping = false }: CurrencySwapFormProps) => {
  const {
    loading,
    formData,
    setFormData,
    errors,
    setErrors,
    availableCurrencies,
    getTokenPrice,
    getUserBalance,
    handleSwap,
    handleFromAmountChange,
    handleToAmountChange,
    handleCurrencySwap
  } = useSwapLogic({ onSwapStart, onSwapSuccess, onSwapError })

  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  const getTokenIcon = (currency: string): string => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Currency Swap</h2>
      
      {errors.currencies && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.currencies}
        </div>
      )}
      
      <div className="space-y-4">
        <CurrencyInput
          label="From"
          amount={formData.fromAmount}
          currency={formData.fromCurrency}
          currencies={availableCurrencies}
          onAmountChange={handleFromAmountChange}
          onCurrencySelect={(currency) => {
            setFormData(prev => ({ ...prev, fromCurrency: currency }))
            setShowFromDropdown(false)
            if (errors.fromCurrency) {
              setErrors(prev => ({ ...prev, fromCurrency: '' }))
            }
          }}
          isDropdownOpen={showFromDropdown}
          onToggleDropdown={() => setShowFromDropdown(!showFromDropdown)}
          getTokenIcon={getTokenIcon}
          getTokenPrice={getTokenPrice}
          getUserBalance={getUserBalance}
          showBalance={true}
          onMaxClick={() => {
            const maxBalance = getUserBalance(formData.fromCurrency)
            handleFromAmountChange(maxBalance.toString())
          }}
          error={errors.fromCurrency}
        />

        <SwapButton onClick={handleCurrencySwap} />

        <CurrencyInput
          label="To"
          amount={formData.toAmount}
          currency={formData.toCurrency}
          currencies={availableCurrencies}
          onAmountChange={handleToAmountChange}
          onCurrencySelect={(currency) => {
            setFormData(prev => ({ ...prev, toCurrency: currency }))
            setShowToDropdown(false)
            if (errors.toCurrency) {
              setErrors(prev => ({ ...prev, toCurrency: '' }))
            }
          }}
          isDropdownOpen={showToDropdown}
          onToggleDropdown={() => setShowToDropdown(!showToDropdown)}
          getTokenIcon={getTokenIcon}
          getTokenPrice={getTokenPrice}
          getUserBalance={getUserBalance}
          error={errors.toCurrency}
        />

        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        {errors.balance && <p className="text-red-500 text-sm">{errors.balance}</p>}

        <ExchangeRate
          fromCurrency={formData.fromCurrency}
          toCurrency={formData.toCurrency}
          fromPrice={getTokenPrice(formData.fromCurrency)}
          toPrice={getTokenPrice(formData.toCurrency)}
        />

        {/* Swap Button */}
        <Button 
          onClick={handleSwap}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold relative"
          disabled={!formData.fromAmount || Number(formData.fromAmount) <= 0 || isSwapping}
        >
          {isSwapping ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Swap...
            </>
          ) : (
            'Swap Tokens'
          )}
        </Button>
      </div>
    </div>
  )
}

export default CurrencySwapForm
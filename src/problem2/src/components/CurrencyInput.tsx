import TokenSelector from './TokenSelector'

interface CurrencyInputProps {
  label: string
  amount: string
  currency: string
  currencies: string[]
  onAmountChange: (value: string) => void
  onCurrencySelect: (currency: string) => void
  isDropdownOpen: boolean
  onToggleDropdown: () => void
  getTokenIcon: (currency: string) => string
  getTokenPrice: (currency: string) => number
  getUserBalance: (currency: string) => number
  showBalance?: boolean
  onMaxClick?: () => void
  error?: string
}

const CurrencyInput = ({
  label,
  amount,
  currency,
  currencies,
  onAmountChange,
  onCurrencySelect,
  isDropdownOpen,
  onToggleDropdown,
  getTokenIcon,
  getTokenPrice,
  getUserBalance,
  showBalance = false,
  onMaxClick,
  error
}: CurrencyInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex-1">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold text-gray-900 placeholder-gray-400 outline-none"
            />
            <div className="text-sm text-gray-500 mt-1">
              ≈ ${(Number(amount) * getTokenPrice(currency) || 0).toFixed(2)} USD
            </div>
            {showBalance && (
              <div className="flex justify-between items-center text-xs text-blue-600 mt-1">
                <span>Balance: {getUserBalance(currency).toFixed(6)} {currency}</span>
                {onMaxClick && (
                  <button
                    onClick={onMaxClick}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Max
                  </button>
                )}
              </div>
            )}
          </div>
          <TokenSelector
            selectedCurrency={currency}
            currencies={currencies}
            onCurrencySelect={onCurrencySelect}
            isOpen={isDropdownOpen}
            onToggle={onToggleDropdown}
            getTokenIcon={getTokenIcon}
            getTokenPrice={getTokenPrice}
            getUserBalance={getUserBalance}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  )
}

export default CurrencyInput
import { ChevronDown, Search } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'

interface TokenSelectorProps {
  selectedCurrency: string
  currencies: string[]
  onCurrencySelect: (currency: string) => void
  isOpen: boolean
  onToggle: () => void
  getTokenIcon: (currency: string) => string
  getTokenPrice: (currency: string) => number
  getUserBalance: (currency: string) => number
}

const TokenSelector = ({
  selectedCurrency,
  currencies,
  onCurrencySelect,
  isOpen,
  onToggle,
  getTokenIcon,
  getTokenPrice,
  getUserBalance
}: TokenSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies
    return currencies.filter(currency => 
      currency.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [currencies, searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-200 hover:bg-gray-50"
      >
        <img
          src={getTokenIcon(selectedCurrency)}
          alt={selectedCurrency}
          className="w-6 h-6"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor">${selectedCurrency.slice(0,3)}</text></svg>`
          }}
        />
        <span className="font-medium">{selectedCurrency}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 w-64">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCurrencies.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500">
                No tokens found
              </div>
            ) : (
              filteredCurrencies.map((currency) => (
            <button
              key={currency}
              onClick={() => onCurrencySelect(currency)}
              className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-gray-50 text-left"
            >
              <img
                src={getTokenIcon(currency)}
                alt={currency}
                className="w-5 h-5"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor">${currency.slice(0,3)}</text></svg>`
                }}
              />
              <div className="flex-1">
                <span>{currency}</span>
                <div className="text-xs text-gray-500">Balance: {getUserBalance(currency).toFixed(4)}</div>
              </div>
              <span className="text-gray-500 text-sm">${getTokenPrice(currency).toFixed(4)}</span>
            </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenSelector
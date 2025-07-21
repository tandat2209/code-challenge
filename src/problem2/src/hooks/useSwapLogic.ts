import { useState, useEffect } from 'react'
import type { TokenPrice, SwapFormData, UserBalance, SwapError, SwapResult } from '../types/swap'

interface UseSwapLogicProps {
  onSwapStart?: () => void
  onSwapSuccess?: (result: SwapResult) => void
  onSwapError?: (error: Error) => void
}

export const useSwapLogic = ({ onSwapStart, onSwapSuccess, onSwapError }: UseSwapLogicProps = {}) => {
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<SwapFormData>({
    fromCurrency: 'USD',
    toCurrency: 'ETH',
    fromAmount: '',
    toAmount: ''
  })
  const [errors, setErrors] = useState<SwapError>({})
  const [userBalances, setUserBalances] = useState<UserBalance>({
    USD: 1000,
    ETH: 2.5,
    USDC: 500,
    ATOM: 100,
    OSMO: 250,
    SWTH: 10000,
    WBTC: 0.1,
    BLUR: 50,
    GMX: 25,
    OKB: 75
  })

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const response = await fetch('https://interview.switcheo.com/prices.json')
      const data = await response.json()
      setPrices(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      setLoading(false)
    }
  }

  const getTokenPrice = (currency: string): number => {
    const token = prices.find(p => p.currency === currency)
    return token?.price || 0
  }

  const getUserBalance = (currency: string): number => {
    return userBalances[currency] || 0
  }

  const updateUserBalance = (currency: string, amount: number) => {
    setUserBalances(prev => ({
      ...prev,
      [currency]: prev[currency] ? prev[currency] + amount : amount
    }))
  }

  const calculateSwap = (amount: string, fromCurrency: string, toCurrency: string): string => {
    if (!amount || isNaN(Number(amount))) return ''
    
    const fromPrice = getTokenPrice(fromCurrency)
    const toPrice = getTokenPrice(toCurrency)
    
    if (fromPrice === 0 || toPrice === 0) return '0'
    
    const usdValue = Number(amount) * fromPrice
    const toAmount = usdValue / toPrice
    
    return toAmount.toFixed(6)
  }

  const validateForm = (): boolean => {
    const newErrors: SwapError = {}
    
    if (!formData.fromAmount || Number(formData.fromAmount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    const fromAmount = Number(formData.fromAmount)
    const userBalance = getUserBalance(formData.fromCurrency)
    
    if (fromAmount > userBalance) {
      newErrors.balance = `Insufficient balance. You have ${userBalance.toFixed(6)} ${formData.fromCurrency}`
    }
    
    if (formData.fromCurrency === formData.toCurrency) {
      newErrors.currencies = 'Please select different currencies'
    }
    
    if (getTokenPrice(formData.fromCurrency) === 0) {
      newErrors.fromCurrency = 'Price not available for selected currency'
    }
    
    if (getTokenPrice(formData.toCurrency) === 0) {
      newErrors.toCurrency = 'Price not available for selected currency'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateTransactionId = (): string => {
    return 'TX' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7).toUpperCase()
  }

  const handleSwap = async () => {
    if (!validateForm()) return
    
    onSwapStart?.()
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
      
      const fromAmount = Number(formData.fromAmount)
      const toAmount = Number(formData.toAmount)
      const fromPrice = getTokenPrice(formData.fromCurrency)
      const toPrice = getTokenPrice(formData.toCurrency)
      const exchangeRate = fromPrice / toPrice
      const totalValueUSD = fromAmount * fromPrice
      
      // Update balances
      updateUserBalance(formData.fromCurrency, -fromAmount)
      updateUserBalance(formData.toCurrency, toAmount)
      
      // Create swap result
      const result: SwapResult = {
        success: true,
        fromAmount,
        toAmount,
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        exchangeRate,
        totalValueUSD,
        timestamp: new Date().toISOString(),
        transactionId: generateTransactionId()
      }
      
      // Clear form
      setFormData({
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        fromAmount: '',
        toAmount: ''
      })
      
      onSwapSuccess?.(result)
      
    } catch (error) {
      const swapError = error instanceof Error ? error : new Error('Swap failed')
      onSwapError?.(swapError)
      console.error('Swap failed:', error)
    }
  }

  const handleFromAmountChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      fromAmount: value,
      toAmount: calculateSwap(value, prev.fromCurrency, prev.toCurrency)
    }))
    
    if (errors.amount || errors.balance) {
      setErrors(prev => ({ ...prev, amount: '', balance: '' }))
    }
  }

  const handleToAmountChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      toAmount: value,
      fromAmount: calculateSwap(value, prev.toCurrency, prev.fromCurrency)
    }))
  }

  const handleCurrencySwap = () => {
    setFormData(prev => ({
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }))
  }

  const availableCurrencies = Array.from(new Set(prices.map(p => p.currency))).sort()

  return {
    prices,
    loading,
    formData,
    setFormData,
    errors,
    setErrors,
    userBalances,
    availableCurrencies,
    getTokenPrice,
    getUserBalance,
    calculateSwap,
    validateForm,
    handleSwap,
    handleFromAmountChange,
    handleToAmountChange,
    handleCurrencySwap
  }

}
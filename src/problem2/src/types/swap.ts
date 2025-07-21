export interface TokenPrice {
  currency: string
  date: string
  price: number
}

export interface SwapFormData {
  fromCurrency: string
  toCurrency: string
  fromAmount: string
  toAmount: string
}

export interface UserBalance {
  [currency: string]: number
}

export interface SwapError {
  [key: string]: string
}

export interface SwapResult {
  success: boolean
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeRate: number
  totalValueUSD: number
  timestamp: string
  transactionId: string
}
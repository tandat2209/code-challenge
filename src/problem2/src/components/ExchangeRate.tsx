interface ExchangeRateProps {
  fromCurrency: string
  toCurrency: string
  fromPrice: number
  toPrice: number
}

const ExchangeRate = ({ fromCurrency, toCurrency, fromPrice, toPrice }: ExchangeRateProps) => {
  if (fromPrice === 0 || toPrice === 0) return null

  const rate = (fromPrice / toPrice).toFixed(6)

  return (
    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
      <div className="flex justify-between">
        <span>Exchange Rate:</span>
        <span>1 {fromCurrency} = {rate} {toCurrency}</span>
      </div>
    </div>
  )
}

export default ExchangeRate
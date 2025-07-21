import { useState } from 'react'
import CurrencySwapForm from "./components/CurrencySwapForm"
import SwapSuccessModal from "./components/SwapSuccessModal"
import type { SwapResult } from "./types/swap"

function App() {
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null)

  const handleSwapStart = () => {
    setIsSwapping(true)
  }

  const handleSwapSuccess = (result: SwapResult) => {
    setIsSwapping(false)
    setSwapResult(result)
  }

  const handleSwapError = (error: Error) => {
    setIsSwapping(false)
    console.error('Swap error:', error)
    // Could show error toast/modal here
  }

  const closeSwapResult = () => {
    setSwapResult(null)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <CurrencySwapForm 
        onSwapStart={handleSwapStart}
        onSwapSuccess={handleSwapSuccess}
        onSwapError={handleSwapError}
        isSwapping={isSwapping}
      />
      
      {swapResult && (
        <SwapSuccessModal
          swapResult={swapResult}
          onClose={closeSwapResult}
        />
      )}
    </div>
  )
}

export default App
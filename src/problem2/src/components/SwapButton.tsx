import { ArrowDownUp } from 'lucide-react'

interface SwapButtonProps {
  onClick: () => void
}

const SwapButton = ({ onClick }: SwapButtonProps) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
      >
        <ArrowDownUp className="w-5 h-5 text-blue-600" />
      </button>
    </div>
  )
}

export default SwapButton
'use client'

interface DirectionSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  color: string
}

export default function DirectionSlider({ label, value, onChange, color }: DirectionSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{label}</span>
        <span className="text-gray-400">{value}%</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${color}`}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

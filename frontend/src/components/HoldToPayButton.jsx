import React, { useState, useEffect, useRef } from 'react'
import { CreditCard } from 'lucide-react'


function HoldToPayButton({ onPaymentComplete, isEnabled = true }) {
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef(null)
  const buttonRef = useRef(null)

  const HOLD_DURATION = 1000 // 1 second to complete payment

  const startHolding = () => {
    if (!isEnabled) return
    
    setIsHolding(true)
    const startTime = Date.now()
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      
      setProgress(newProgress)
      
      if (newProgress >= 100) {
        completePayment()
      }
    }, 16) // ~60fps updates
  }

  const stopHolding = () => {
    setIsHolding(false)
    clearInterval(progressInterval.current)
    
    // Gradually decrease progress
    const fadeInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - 5
        if (newProgress <= 0) {
          clearInterval(fadeInterval)
          return 0
        }
        return newProgress
      })
    }, 30)
  }

  const completePayment = () => {
    clearInterval(progressInterval.current)
    setIsHolding(false)
    setProgress(100)
    
    // Trigger success animation
    setTimeout(() => {
      onPaymentComplete()
      setProgress(0)
    }, 500)
  }

  useEffect(() => {
    return () => {
      clearInterval(progressInterval.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <button
          ref={buttonRef}
          className={`
            relative overflow-hidden px-12 py-6 rounded-full text-white font-bold text-lg
            transition-all duration-200 transform
            ${isEnabled 
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95' 
              : 'bg-gray-400 cursor-not-allowed'
            }
            ${isHolding ? 'scale-105 shadow-lg' : 'shadow-md'}
          `}
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          disabled={!isEnabled}
        >
          {/* Progress overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 transition-all duration-75 ease-out"
            style={{
              width: `${progress}%`,
              opacity: progress > 0 ? 0.8 : 0
            }}
          />
          
          {/* Button content */}
          <div className="relative flex items-center space-x-2">
            <CreditCard size={24} />
            <span>Hold to Pay</span>
          </div>
          
          {/* Pulse animation when holding */}
          {isHolding && (
            <div className="absolute inset-0 rounded-full border-4 border-white opacity-75 animate-ping" />
          )}
        </button>
        
        {/* Progress ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-75 ease-out"
            />
          </svg>
        </div>
      </div>
      
      
      {progress > 0 && (
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default HoldToPayButton;
import React, { useState, useEffect } from 'react'

function NotificationBar({ type, message }) {
  const [visible, setVisible] = useState(!!message)

  useEffect(() => {
    setVisible(!!message)
  }, [message])

  if (!visible || !message) return null

  const baseClasses = 'p-3 rounded mb-4 flex items-start justify-between gap-4'
  const typeClasses =
    type === 'success'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button
        className="text-xl font-bold leading-none focus:outline-none hover:cursor-pointer"
        onClick={() => setVisible(false)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export default NotificationBar

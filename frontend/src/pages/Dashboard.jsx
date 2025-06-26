import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import NotificationBar from '../components/NotificationBar'
import HoldToPayButton from '../components/HoldToPayButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'


function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [meterNumber, setMeterNumber] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [formNotification, setFormNotification] = useState(null)
  const [tableNotification, setTableNotification] = useState(null)
  const [payments, setPayments] = useState([
    // Mock data for demonstration
    // { id: 1, date: '2025-06-25', paymentAmount: '125.50', status: 'completed' },
    // { id: 2, date: '2025-06-20', paymentAmount: '98.75', status: 'pending' },
    // { id: 3, date: '2025-06-15', paymentAmount: '156.20', status: 'completed' }
  ])
  const [loading, setLoading] = useState(false)

  const { user } = useUser()

  useEffect(() => {
    fetchPayments()
  }, [user])

  async function fetchPayments() {
    setLoading(true)
    setTableNotification(null)

    if (user) {
      try {
        const res = await fetch(`http://localhost:6000/api/biller/?userId=${user.id}`)
        if (!res.ok) throw new Error('Failed to fetch payments')
        const data = await res.json()
        setPayments(data)
      } catch (err) {
        setTableNotification({ type: 'error', message: err.message })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFormSubmit = () => {
    setFormNotification(null)

    if (!meterNumber || !paymentAmount) {
      setFormNotification({ type: 'error', message: 'Please fill all fields' })
      return
    }

    // Move to next step instead of submitting immediately
    setCurrentStep(2)
  }

  const handlePaymentComplete = () => {
    // Simulate payment processing
    setFormNotification({ type: 'success', message: 'Payment completed successfully!' })
    
    // Add new payment to history
    const newPayment = {
      id: payments.length + 1,
      date: new Date().toISOString(),
      paymentAmount: paymentAmount,
      status: 'completed'
    }
    setPayments(prev => [newPayment, ...prev])
    
    // Reset form and go back to step 1
    setTimeout(() => {
      setMeterNumber('')
      setPaymentAmount('')
      setCurrentStep(1)
      setFormNotification(null)
    }, 2000)
  }

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          1
        </div>
        <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          2
        </div>
      </div>

      {/* Step 1: Payment Form */}
      {currentStep === 1 && (
        <div className="border p-6 rounded-lg shadow-sm space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Enter Payment Details</h2>
          
          <NotificationBar {...formNotification} />

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Meter Number</label>
                <input
                  type="text"
                  value={meterNumber}
                  onChange={e => setMeterNumber(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter meter number"
                />
              </div>

              <div className="flex-1 mt-4 md:mt-0">
                <label className="block mb-1 font-semibold">Payment Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFormSubmit}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Confirmation */}
      {currentStep === 2 && (
        <div className="border p-8 rounded-lg shadow-sm space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6">Confirm Payment</h2>
          
          <NotificationBar {...formNotification} />

          {/* Payment Summary */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">Meter Number:</span>
              <span>{meterNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Amount:</span>
              <span className="text-xl font-bold text-green-600"> {paymentAmount} ৳</span>
            </div>
          </div>

          {/* Hold to Pay Button */}
          <div className="flex justify-center py-8">
            <HoldToPayButton 
              onPaymentComplete={handlePaymentComplete}
              isEnabled={!!meterNumber && !!paymentAmount}
            />
          </div>

          {/* Back Button */}
          <div className="flex justify-start">
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition flex items-center space-x-2"
            >
              <ChevronLeft size={16} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>

        <NotificationBar {...tableNotification} />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Payment Amount</th>
                  <th className="border p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="border p-3 text-center text-gray-500">
                      No previous payments
                    </td>
                  </tr>
                ) : (
                  payments.map(({ id, date, paymentAmount, status }) => (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-3">{new Date(date).toLocaleDateString()}</td>
                      <td className="border p-3"> {paymentAmount} ৳ </td>
                      <td className="border p-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
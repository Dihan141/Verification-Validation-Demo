import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import NotificationBar from '../components/NotificationBar'

function Dashboard() {
  const [meterNumber, setMeterNumber] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [formNotification, setFormNotification] = useState(null)
  const [tableNotification, setTableNotification] = useState(null)
  const [payments, setPayments] = useState([])
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

  const handleSubmit = async e => {
    e.preventDefault()
    setFormNotification(null)

    if (!meterNumber || !paymentAmount) {
      setFormNotification({ type: 'error', message: 'Please fill all fields' })
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/biller/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, meterNumber, paymentAmount }),
      })

      if (!res.ok) throw new Error('Payment submission failed')

      setFormNotification({ type: 'success', message: 'Payment submitted successfully' })
      setMeterNumber('')
      setPaymentAmount('')
      fetchPayments()
    } catch (err) {
      setFormNotification({ type: 'error', message: err.message })
    }
  }

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="border p-6 rounded shadow space-y-4">
        <NotificationBar {...formNotification} />

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Meter Number</label>
            <input
              type="text"
              value={meterNumber}
              onChange={e => setMeterNumber(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-indigo-500"
              placeholder="Enter meter number"
            />
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <label className="block mb-1 font-semibold">Payment Amount</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-indigo-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>

      {/* Payments List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>

        <NotificationBar {...tableNotification} />

        {loading ? (
          <p>Loading payments...</p>
        ) : (
          <table className="w-full border-collapse">
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
                    No previous payment
                  </td>
                </tr>
              ) : (
                payments.map(({ id, date, paymentAmount, status }) => (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="border p-3">{new Date(date).toLocaleDateString()}</td>
                    <td className="border p-3">${paymentAmount}</td>
                    <td className="border p-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard

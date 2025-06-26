import React from 'react'
import billImage from '../assets/bill-payment.jpg'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-4 px-6 md:px-20 gap-12 w-full">

      {/* Image container fills half width */}
      <div className="flex-1">
        <img
          src={billImage}
          alt="Paying bills"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{ maxHeight: '600px' }}
        />
      </div>

      {/* Text container fills half width */}
      <div className="flex-1 flex flex-col justify-center text-center md:text-left">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          Pay Your Bills Reliably
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-lg mx-auto md:mx-0">
          No more late fees, no more hassles. Manage all your bill payments in one place —
          fast, secure, and always on time.
        </p>
        <Link
          to="/sign-in"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-300 mr-12 inline-block text-center"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default Home

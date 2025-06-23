import { SignUp } from '@clerk/clerk-react'
import React from 'react'

function Signup() {
  return (
    <div className='flex items-center justify-center h-[calc(100vh-77px)] bg-white'>
        <SignUp signInUrl='./sign-in'/>
    </div>
  )
}

export default Signup
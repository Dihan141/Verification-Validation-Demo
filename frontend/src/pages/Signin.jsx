import React from 'react'

import { SignIn } from '@clerk/clerk-react'

function Signin() {
  return (
    <div className='flex items-center justify-center h-[calc(100vh-77px)] bg-white'>
        <SignIn signUpUrl='./sign-up' />
    </div>
  )
}

export default Signin
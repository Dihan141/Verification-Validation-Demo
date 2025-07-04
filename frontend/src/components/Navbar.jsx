import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';

import { CiMenuFries, CiMenuBurger } from "react-icons/ci";

function Navbar() {
    const [nav, setNav] = useState(false)
    const { user } = useUser();
    const [balance, setBalance] = useState(null);

    const handleNav = () => {
        setNav(!nav)
    }

    // Prevent body scroll when nav is open
    useEffect(() => {
        if (nav) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [nav])

    useEffect(() => {
        const fetchBalance = async () => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:5000/api/users/balance/${user.id}`);
                    const data = await response.json();
                    setBalance(data.balance); // Make sure backend returns { balance: number }
                } catch (err) {
                    console.error('Failed to fetch balance:', err);
                }
            }
        };

        fetchBalance();
    }, [user]);


    return (
        <>
            <div className='bg-gray-100 p-4 relative z-50'>
                <nav className='flex justify-between items-center'>
                    <div className='flex items-center space-x-4'>
                        <div className='text-2xl sm:hidden cursor-pointer z-50'>
                            {nav ? (<CiMenuFries onClick={handleNav}/>) : (<CiMenuBurger onClick={handleNav}/>)}
                        </div>
                        <h1 className='text-[24px] sm:text-[30px] font-bold cursor-pointer'><Link to='/'>PayBill</Link></h1>
                    </div>
                    <ul className='flex space-x-4'>
                        {/* <li className='hidden sm:block font-semibold p-2 rounded hover:text-purple-400'>
                            Feed 
                        </li>
                        <li className='hidden sm:block font-semibold p-2 rounded hover:text-purple-400'>
                            Post
                        </li>
                        <li className='hidden sm:block font-semibold p-2 rounded hover:text-purple-400'>
                            My reviews
                        </li> */}
                        <li className='flex items-center'>
                            <div className='bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[100px] text-center flex items-center justify-center space-x-1'>
                                <span className='text-sm text-gray-600'>Balance</span>
                                <div className='font-semibold text-green-600'>
                                    {balance !== null ? `${balance} ৳` : '...'}
                                </div>
                            </div>
                        </li> 
                        <SignedOut>
                            <li className='hidden sm:block font-semibold p-2 rounded hover:text-purple-400'>
                                <Link to='/sign-up'> Sign Up</Link> 
                            </li>
                            <li className=' text-white px-4 py-2 font-semibold bg-purple-500 rounded-full hover:bg-purple-400'>
                                <Link to='/sign-in'> Log In</Link>
                            </li>
                        </SignedOut>
                        <SignedIn>
                            {/* <li className='hidden sm:block font-semibold p-2 rounded hover:text-purple-400'>
                                My bills
                            </li> */}
                            <li className='mt-2'>
                                <UserButton />
                            </li>
                        </SignedIn>
                    </ul>
                </nav>
            </div>

            {/* Overlay for dimming effect */}
            {nav && (
                <div 
                    className='fixed inset-0 bg-black/30 z-40 sm:hidden'
                    onClick={handleNav}
                />
            )}

            {/* Mobile Navigation Menu */}
            {nav && (
                <div className='fixed sm:hidden top-20 left-0 right-0 bg-gray-100 w-full p-4 z-50 shadow-lg'>
                    <ul className='flex flex-col space-y-4 items-center'>
                        <SignedOut>
                            <li className='font-semibold' onClick={handleNav}>
                                <Link to='/sign-up'> Sign Up</Link> 
                            </li>
                        </SignedOut>
                        {/* <li className='font-semibold'>
                            Feed
                        </li>
                        <li className='font-semibold'>
                            Post a review
                        </li> */}
                        {/* <li className='font-semibold'>
                            My Bills
                        </li> */}
                    </ul>
                </div>
            )}
        </>
    )
}

export default Navbar
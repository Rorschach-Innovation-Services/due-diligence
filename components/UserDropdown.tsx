'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';


interface NavbarProps {
    onHomeClick: () => void;
}


export default function UserDropdown() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { user, error, isLoading } = useUser();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
        localStorage.setItem('editMode', JSON.stringify(false));
    };


    return (
        user ? (
            <div className="relative inline-block text-left">
                <button
                    id="dropdownInformationButton"
                    onClick={toggleDropdown}
                    className="text-white bg-gray-700 hover:bg-gay-800 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:bg-gray-200 dark:hover:bg-gray-400 dark:focus:ring-gray-600"
                    type="button"
                >
                    <img className='w-10 h-10 rounded-full'
                        src={user.picture ?? "P"} alt="User Profile" />
                    {/* <FontAwesomeIcon icon={faUserCircle} /> */}
                </button>



                {isDropdownOpen && (
                    <div
                        id="dropdownInformation"
                        className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                    >
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div className='font-medium'>{user.name}</div>
                            <div className=" truncate">{user.email}</div>
                        </div>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    Enable edit
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    Settings
                                </a>
                            </li>
                        </ul>
                        <div className="py-2">
                            <a
                                href="/api/auth/logout"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                )}
            </div>
        ) :
            <Link href="/api/auth/login">Sign in</Link>
    );
};


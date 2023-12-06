import { useUser } from '@auth0/nextjs-auth0/client';
import { faEdit, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

interface UserDropdownProps {
  onToggleEditMode: (editMode: boolean) => void;
}

export default function UserDropdown({ onToggleEditMode }: UserDropdownProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, error, isLoading } = useUser();
  const [editMode, setEditMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check local storage for the initial value of editMode
    const storedEditMode = localStorage.getItem('editMode');
    if (storedEditMode !== null) {
      const parsedEditMode = JSON.parse(storedEditMode);
      setEditMode(parsedEditMode);
      onToggleEditMode(parsedEditMode);
    }
  }, []); 

  const handleClickOutside = (event: MouseEvent) => {
    // Check if dropdownRef.current is null
    if (dropdownRef.current === null || !(event.target instanceof Node)) {
      return;
    }
  
    // Check if the click is outside the dropdown
    if (!dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => setDropdownOpen(false);
  
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);
  

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    localStorage.setItem('editMode', JSON.stringify(newEditMode));
    setEditMode(newEditMode);
    onToggleEditMode(newEditMode);
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
        </button>

        {isDropdownOpen && (
          <div
            id="dropdownInformation"
            className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div className=" truncate">{user.email}</div>
            </div>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
              {/* <li>
                <p className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Profile
                </p>
              </li> */}
              <li>
                <button onClick={toggleEditMode} className={`w-full hover:bg-gray-100 dark:hover:bg-gray-600 block px-4 py-2 italic text-sm text-${editMode ? "red" : "blue"}-400 font-bold inline-flex items-center`}>
                  <FontAwesomeIcon className="mr-1" icon={editMode ? faEye : faEdit} />
                  <span>{editMode ? "Disable Edit" : "Enable Edit"}</span>
                </button>
              </li>
            </ul>
            <div className="py-2">
              <Link
                href="/api/auth/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </Link>
            </div>
          </div>
        )}
      </div>
    ) :
      <Link href="/api/auth/login">Sign in</Link>
  );
};

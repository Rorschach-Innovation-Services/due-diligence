

import Link from 'next/link'
import SearchBar from './SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import UserDropdown from './UserDropdown';

interface NavbarProps {
  onToggleAside: () => void;
  onHomeClick: () => void;
}

export default function Navbar({ onToggleAside, onHomeClick }: NavbarProps) {
 

  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-gray-300">
      <button onClick={onToggleAside} className="text-black mr-0 h-full px-4 hover:bg-gray-100">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <button onClick={onHomeClick}  className=' px-4 mr-2 h-full hover:bg-gray-100'>home</button>
      <SearchBar placeholder='Search Q and As' />

      <div className="space-x-6 flex  align-center">
        <UserDropdown />
      </div>
    </nav>
  )
}
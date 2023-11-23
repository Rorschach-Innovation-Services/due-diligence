
import Link from 'next/link'
import SearchBar from './SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPerson, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  onToggleAside: () => void;
}

export default function Navbar({ onToggleAside }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-gray-300">
      <button onClick={onToggleAside} className="text-black mr-6">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <SearchBar placeholder='Search Q and As' />

      <div className="space-x-6 flex  align-center">
        <Link href="/about">
          <FontAwesomeIcon icon={faUserCircle}/>
        </Link>
      </div>
    </nav>
  )
}
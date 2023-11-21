
import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-gray-300">

      {/* <div> */}
      <SearchBar placeholder='Search Q and As' />
      {/* </div> */}

      <div className="space-x-6 flex  align-center">
        <Link href="/">
          Questions
        </Link>
        <Link href="/about">
          About
        </Link>
      </div>
    </nav>
  )
}
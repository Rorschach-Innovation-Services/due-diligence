
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-gray-300">

      <div>
        search
      </div>

      <div className="space-x-6 mt-2">
        {/* nav links */}
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
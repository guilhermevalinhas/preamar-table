import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useState } from 'react'
import { Menu as MenuIcon, X } from 'lucide-react'

const link = 'px-4 py-3 rounded-md text-base md:text-sm font-medium'
const active = 'bg-blue-600 text-white'
const idle = 'text-gray-700 hover:bg-gray-100'

export default function Nav() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const items: [string, string][] = [
    ['ingredients', 'Ingredients'],
    ['preparations', 'Preparations'],
    ['dishes', 'Dishes'],
    ['menus', 'Menus'],
    ['events', 'Events'],
    ['suppliers', 'Suppliers']
  ]

  function NavItems({ onClick }:{ onClick?:()=>void }){
    return (
      <nav className="flex flex-col md:flex-row md:items-center gap-1 md:gap-1">
        {items.map(([to, label]) => (
          <NavLink
            key={to}
            to={`/${to}`}
            onClick={()=>{ onClick?.(); }}
            className={({ isActive }) => `${link} ${isActive ? active : idle}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-lg border"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={()=>setOpen(!open)}
          >
            {open ? <X size={20}/> : <MenuIcon size={20}/>}
          </button>
          <span className="font-semibold select-none">Preamar — Costing</span>
        </div>
        <div className="hidden md:block">
          <NavItems />
        </div>
        <button
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
          onClick={async () => { await signOut(auth); navigate('/signin') }}
        >
          Sign out
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-2">
            <NavItems onClick={()=>setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}

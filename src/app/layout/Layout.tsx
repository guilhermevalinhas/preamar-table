import { Outlet } from 'react-router-dom'
import Nav from './Nav'

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}

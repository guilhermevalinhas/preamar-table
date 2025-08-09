import { FormEvent, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const nav = useNavigate()
  const loc = useLocation() as any

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      nav(loc.state?.from?.pathname || '/')
    } catch (e: any) { setErr(e.message) }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={onSubmit} className="bg-white border rounded-lg p-6 w-full max-w-md space-y-3">
        <h1 className="text-lg font-semibold">Sign in</h1>
        <input className="w-full border rounded px-3 py-3" placeholder="Email" inputMode="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-blue-600 text-white rounded px-3 py-3 active:scale-[0.99]">Continue</button>
        <p className="text-sm text-gray-600">No account? <Link className="text-blue-700" to="/signup">Create one</Link></p>
      </form>
    </div>
  )
}

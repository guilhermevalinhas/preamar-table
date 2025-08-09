import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthState } from '../../lib/firebase'
import { createWithOwner, getById, setDocById } from '../../lib/db'
import { Supplier } from '../../lib/types'

export default function SupplierEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuthState()
  const [m, setM] = useState<Partial<Supplier>>({ name: '' })

  useEffect(() => { (async () => { if (id && id !== 'new') { const doc = await getById<Supplier>('suppliers', id); if (doc) setM(doc) } })() }, [id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !m.name) return
    if (!id || id === 'new') await createWithOwner<Supplier>(user, 'suppliers', m as Supplier)
    else await setDocById('suppliers', id, m)
    nav('/suppliers')
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3 max-w-xl">
      <h1 className="text-lg font-semibold">{id === 'new' ? 'New Supplier' : 'Edit Supplier'}</h1>
      <input className="w-full border rounded px-3 py-3" placeholder="Name" value={m.name || ''} onChange={e=>setM({...m, name: e.target.value})}/>
      <input className="w-full border rounded px-3 py-3" placeholder="Email" value={m.email || ''} onChange={e=>setM({...m, email: e.target.value})}/>
      <input className="w-full border rounded px-3 py-3" placeholder="Phone" value={m.phone || ''} onChange={e=>setM({...m, phone: e.target.value})}/>
      <input className="w-full border rounded px-3 py-3" placeholder="Location" value={m.location || ''} onChange={e=>setM({...m, location: e.target.value})}/>
      <textarea className="w-full border rounded px-3 py-3" placeholder="Comments" value={m.comments || ''} onChange={e=>setM({...m, comments: e.target.value})}/>
      <button className="bg-blue-600 text-white rounded px-4 py-3">Save</button>
    </form>
  )
}

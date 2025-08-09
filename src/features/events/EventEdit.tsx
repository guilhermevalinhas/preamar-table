import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthState } from '../../lib/firebase'
import { createWithOwner, getById, setDocById } from '../../lib/db'
import { Event, EventExtra } from '../../lib/types'

export default function EventEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuthState()
  const [m, setM] = useState<Partial<Event>>({ name: '', date: '', guestCount: 1, extras: [] })

  useEffect(() => { (async () => {
    if (id && id !== 'new') { const doc = await getById<Event>('events', id); if (doc) setM(doc) }
  })() }, [id])

  function addExtra() {
    const ex = m.extras || []
    setM({ ...m, extras: [...ex, { name: '', cost: 0 } as EventExtra] })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !m.name) return
    if (!id || id === 'new') await createWithOwner<Event>(user, 'events', m as Event)
    else await setDocById('events', id, m)
    nav('/events')
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3 max-w-3xl">
      <h1 className="text-lg font-semibold">{id === 'new' ? 'New Event' : 'Edit Event'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-3" placeholder="Name" value={m.name || ''} onChange={e=>setM({...m, name: e.target.value})}/>
        <input type="date" className="border rounded px-3 py-3" value={m.date || ''} onChange={e=>setM({...m, date: e.target.value})}/>
        <input type="number" className="border rounded px-3 py-3" placeholder="Guests" value={m.guestCount || 1} onChange={e=>setM({...m, guestCount: Number(e.target.value)})}/>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Extras</h2>
          <button type="button" className="text-blue-700" onClick={addExtra}>Add extra</button>
        </div>
        {(m.extras || []).map((row, i)=>(
          <div key={i} className="grid grid-cols-2 gap-2 mt-2">
            <input className="border rounded px-2 py-2" placeholder="Name" value={row.name} onChange={e=>{
              const ex=[...(m.extras||[])]; ex[i]={...row, name:e.target.value}; setM({...m, extras: ex})
            }}/>
            <input type="number" step="0.01" className="border rounded px-2 py-2" placeholder="Cost (GBP)" value={row.cost} onChange={e=>{
              const ex=[...(m.extras||[])]; ex[i]={...row, cost:Number(e.target.value)}; setM({...m, extras: ex})
            }}/>
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white rounded px-4 py-3 mt-3">Save</button>
    </form>
  )
}

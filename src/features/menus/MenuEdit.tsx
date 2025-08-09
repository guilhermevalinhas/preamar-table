import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthState } from '../../lib/firebase'
import { createWithOwner, getById, setDocById } from '../../lib/db'
import { Menu, Unit, MenuEntry } from '../../lib/types'

const unitOptions: Unit[] = ['serv','each','g','kg','ml','l','tbsp','tsp','oz','lb']

export default function MenuEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuthState()
  const [m, setM] = useState<Partial<Menu>>({ name: '', peopleCount: 1, entries: [] })

  useEffect(() => { (async () => {
    if (id && id !== 'new') { const doc = await getById<Menu>('menus', id); if (doc) setM(doc) }
  })() }, [id])

  function addEntry() {
    const es = m.entries || []
    setM({ ...m, entries: [...es, { dishId: '', qty: 1, unit: 'serv' } as MenuEntry] })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !m.name) return
    if (!id || id === 'new') await createWithOwner<Menu>(user, 'menus', m as Menu)
    else await setDocById('menus', id, m)
    nav('/menus')
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3 max-w-3xl">
      <h1 className="text-lg font-semibold">{id === 'new' ? 'New Menu' : 'Edit Menu'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-3" placeholder="Name" value={m.name || ''} onChange={e=>setM({...m, name: e.target.value})}/>
        <input type="date" className="border rounded px-3 py-3" value={m.date || ''} onChange={e=>setM({...m, date: e.target.value})}/>
        <input type="number" className="border rounded px-3 py-3" placeholder="People" value={m.peopleCount || 1} onChange={e=>setM({...m, peopleCount: Number(e.target.value)})}/>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Dishes</h2>
          <button type="button" className="text-blue-700" onClick={addEntry}>Add dish</button>
        </div>
        {(m.entries || []).map((row, i)=>(
          <div key={i} className="grid grid-cols-4 gap-2 mt-2">
            <input className="border rounded px-2 py-2" placeholder="Dish ID" value={row.dishId} onChange={e=>{
              const es=[...(m.entries||[])]; es[i]={...row, dishId:e.target.value}; setM({...m, entries: es})
            }}/>
            <input type="number" step="0.1" className="border rounded px-2 py-2" placeholder="Qty" value={row.qty} onChange={e=>{
              const es=[...(m.entries||[])]; es[i]={...row, qty:Number(e.target.value)}; setM({...m, entries: es})
            }}/>
            <select className="border rounded px-2 py-2" value={row.unit} onChange={e=>{
              const es=[...(m.entries||[])]; es[i]={...row, unit:e.target.value as Unit}; setM({...m, entries: es})
            }}>{unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}</select>
            <div />
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white rounded px-4 py-3 mt-3">Save</button>
    </form>
  )
}

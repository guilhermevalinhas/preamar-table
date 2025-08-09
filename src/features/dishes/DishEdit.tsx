import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthState } from '../../lib/firebase'
import { createWithOwner, getById, setDocById } from '../../lib/db'
import { Dish, Unit, LineItemRef } from '../../lib/types'

const unitOptions: Unit[] = ['g','kg','ml','l','each','serv','tbsp','tsp','oz','lb']

export default function DishEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuthState()
  const [m, setM] = useState<Partial<Dish>>({
    name: '', yieldQty: 1, yieldUnit: 'serv', sellingPrice: 0, items: []
  })

  useEffect(() => { (async () => {
    if (id && id !== 'new') { const doc = await getById<Dish>('dishes', id); if (doc) setM(doc) }
  })() }, [id])

  function addItem() {
    const rows = m.items || []
    setM({ ...m, items: [...rows, { refType: 'preparation', refId: '', qty: 1, unit: 'serv' } as LineItemRef] })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !m.name) return
    if (!id || id === 'new') await createWithOwner<Dish>(user, 'dishes', m as Dish)
    else await setDocById('dishes', id, m)
    nav('/dishes')
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3 max-w-3xl">
      <h1 className="text-lg font-semibold">{id === 'new' ? 'New Dish' : 'Edit Dish'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-3" placeholder="Name" value={m.name || ''} onChange={e=>setM({...m, name: e.target.value})}/>
        <input type="number" step="0.001" className="border rounded px-3 py-3" placeholder="Yield qty" value={m.yieldQty || 1} onChange={e=>setM({...m, yieldQty: Number(e.target.value)})}/>
        <select className="border rounded px-3 py-3" value={m.yieldUnit || 'serv'} onChange={e=>setM({...m, yieldUnit: e.target.value as Unit})}>
          {unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}
        </select>
        <input type="number" step="0.01" className="border rounded px-3 py-3" placeholder="Selling price (GBP)" value={m.sellingPrice ?? 0} onChange={e=>setM({...m, sellingPrice: Number(e.target.value)})}/>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Items (ingredients or preps)</h2>
          <button type="button" className="text-blue-700" onClick={addItem}>Add item</button>
        </div>
        {(m.items || []).map((row, i)=>(
          <div key={i} className="grid grid-cols-4 gap-2 mt-2">
            <select className="border rounded px-2 py-2" value={row.refType} onChange={e=>{
              const items=[...(m.items||[])]; items[i]={...row, refType: e.target.value as 'ingredient'|'preparation'}; setM({...m, items})
            }}>
              <option value="ingredient">ingredient</option>
              <option value="preparation">preparation</option>
            </select>
            <input className="border rounded px-2 py-2" placeholder="Ref ID" value={row.refId} onChange={e=>{
              const items=[...(m.items||[])]; items[i]={...row, refId:e.target.value}; setM({...m, items})
            }}/>
            <input type="number" step="0.001" className="border rounded px-2 py-2" placeholder="Qty" value={row.qty} onChange={e=>{
              const items=[...(m.items||[])]; items[i]={...row, qty:Number(e.target.value)}; setM({...m, items})
            }}/>
            <select className="border rounded px-2 py-2" value={row.unit} onChange={e=>{
              const items=[...(m.items||[])]; items[i]={...row, unit:e.target.value as Unit}; setM({...m, items})
            }}>{unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}</select>
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white rounded px-4 py-3 mt-3">Save</button>
    </form>
  )
}

import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthState } from '../../lib/firebase'
import { createWithOwner, getById, setDocById } from '../../lib/db'
import { Ingredient, Unit } from '../../lib/types'

const unitOptions: Unit[] = ['g','kg','ml','l','each','serv','tbsp','tsp','oz','lb']

export default function IngredientEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuthState()
  const [m, setM] = useState<Partial<Ingredient>>({
    name: '', purchaseQty: 1, purchaseUnit: 'kg', price: 0, measurements: [], wastage: []
  })

  useEffect(() => { (async () => {
    if (id && id !== 'new') { const doc = await getById<Ingredient>('ingredients', id); if (doc) setM(doc) }
  })() }, [id])

  function addMeasurement() {
    const ms = m.measurements || []
    setM({ ...m, measurements: [...ms, { name: '', fromQty: 1, fromUnit: 'kg', toQty: 1000, toUnit: 'g' }] })
  }
  function addWastage() {
    const ws = m.wastage || []
    setM({ ...m, wastage: [...ws, { type: '', percent: 0 }] })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !m.name) return
    if (!id || id === 'new') await createWithOwner<Ingredient>(user, 'ingredients', m as Ingredient)
    else await setDocById('ingredients', id, m)
    nav('/ingredients')
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 space-y-3 max-w-3xl">
      <h1 className="text-lg font-semibold">{id === 'new' ? 'New Ingredient' : 'Edit Ingredient'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-3" placeholder="Name" value={m.name || ''} onChange={e=>setM({...m, name: e.target.value})}/>
        <input className="border rounded px-3 py-3" placeholder="Category" value={m.category || ''} onChange={e=>setM({...m, category: e.target.value})}/>
        <div className="flex gap-2">
          <input type="number" step="0.001" className="border rounded px-3 py-3 w-36" placeholder="Pack qty" value={m.purchaseQty || 1} onChange={e=>setM({...m, purchaseQty: Number(e.target.value)})}/>
          <select className="border rounded px-3 py-3" value={m.purchaseUnit || 'kg'} onChange={e=>setM({...m, purchaseUnit: e.target.value as Unit})}>
            {unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <input type="number" step="0.01" className="border rounded px-3 py-3" placeholder="Price (GBP)" value={m.price ?? 0} onChange={e=>setM({...m, price: Number(e.target.value)})}/>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Measurements</h2>
          <button type="button" className="text-blue-700" onClick={addMeasurement}>Add measurement</button>
        </div>
        {(m.measurements || []).map((row, i)=>(
          <div key={i} className="grid grid-cols-5 gap-2 mt-2">
            <input className="border rounded px-2 py-2" placeholder="Name" value={row.name} onChange={e=>{
              const ms=[...(m.measurements||[])]; ms[i]={...row, name:e.target.value}; setM({...m, measurements: ms})
            }}/>
            <input type="number" step="0.001" className="border rounded px-2 py-2" placeholder="From qty" value={row.fromQty} onChange={e=>{
              const ms=[...(m.measurements||[])]; ms[i]={...row, fromQty:Number(e.target.value)}; setM({...m, measurements: ms})
            }}/>
            <select className="border rounded px-2 py-2" value={row.fromUnit} onChange={e=>{
              const ms=[...(m.measurements||[])]; ms[i]={...row, fromUnit:e.target.value as Unit}; setM({...m, measurements: ms})
            }}>{unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}</select>
            <input type="number" step="0.001" className="border rounded px-2 py-2" placeholder="To qty" value={row.toQty} onChange={e=>{
              const ms=[...(m.measurements||[])]; ms[i]={...row, toQty:Number(e.target.value)}; setM({...m, measurements: ms})
            }}/>
            <select className="border rounded px-2 py-2" value={row.toUnit} onChange={e=>{
              const ms=[...(m.measurements||[])]; ms[i]={...row, toUnit:e.target.value as Unit}; setM({...m, measurements: ms})
            }}>{unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}</select>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Wastage</h2>
          <button type="button" className="text-blue-700" onClick={addWastage}>Add wastage</button>
        </div>
        {(m.wastage || []).map((row, i)=>(
          <div key={i} className="grid grid-cols-3 gap-2 mt-2">
            <input className="border rounded px-2 py-2" placeholder="Type" value={row.type} onChange={e=>{
              const ws=[...(m.wastage||[])]; ws[i]={...row, type:e.target.value}; setM({...m, wastage: ws})
            }}/>
            <input type="number" step="0.1" className="border rounded px-2 py-2" placeholder="% loss" value={row.percent} onChange={e=>{
              const ws=[...(m.wastage||[])]; ws[i]={...row, percent:Number(e.target.value)}; setM({...m, wastage: ws})
            }}/>
            <input className="border rounded px-2 py-2" placeholder="Notes" value={row.notes || ''} onChange={e=>{
              const ws=[...(m.wastage||[])]; ws[i]={...row, notes:e.target.value}; setM({...m, wastage: ws})
            }}/>
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white rounded px-4 py-3 mt-3">Save</button>
    </form>
  )
}

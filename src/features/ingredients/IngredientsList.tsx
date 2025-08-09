import { useEffect, useState } from 'react'
import { useAuthState } from '../../lib/firebase'
import { subscribeOwnerList, removeById } from '../../lib/db'
import { Ingredient } from '../../lib/types'
import { Link } from 'react-router-dom'
import Table from '../../components/Table'

export default function IngredientsList() {
  const { user } = useAuthState()
  const [rows, setRows] = useState<(Ingredient & { id: string })[]>([])
  useEffect(() => { if (!user) return; return subscribeOwnerList<Ingredient>(user, 'ingredients', setRows) }, [user])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Ingredients</h1>
        <Link to="new" className="bg-blue-600 text-white px-4 py-3 rounded">Create</Link>
      </div>
      <Table thead={<tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Pack</th><th className="px-3 py-2">Price</th><th className="px-3 py-2">Updated</th><th className="px-3 py-2">Actions</th></tr>}>
        {rows.map(r=>(
          <tr key={r.id}>
            <td className="px-3 py-2">{r.name}</td>
            <td className="px-3 py-2">{r.purchaseQty} {r.purchaseUnit}</td>
            <td className="px-3 py-2">£{(r.price ?? 0).toFixed(2)}</td>
            <td className="px-3 py-2">{r.lastUpdated || ''}</td>
            <td className="px-3 py-2">
              <Link className="text-blue-700 mr-3" to={r.id}>Edit</Link>
              <button className="text-red-700" onClick={()=>removeById('ingredients', r.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}

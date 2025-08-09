import { useEffect, useState } from 'react'
import { useAuthState } from '../../lib/firebase'
import { subscribeOwnerList, removeById } from '../../lib/db'
import { Event } from '../../lib/types'
import { Link } from 'react-router-dom'
import Table from '../../components/Table'

export default function EventsList() {
  const { user } = useAuthState()
  const [rows, setRows] = useState<(Event & { id: string })[]>([])
  useEffect(() => { if (!user) return; return subscribeOwnerList<Event>(user, 'events', setRows) }, [user])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Events</h1>
        <Link to="new" className="bg-blue-600 text-white px-4 py-3 rounded">Create</Link>
      </div>
      <Table thead={<tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Guests</th><th className="px-3 py-2">Actions</th></tr>}>
        {rows.map(r=>(
          <tr key={r.id}>
            <td className="px-3 py-2">{r.name}</td>
            <td className="px-3 py-2">{r.date}</td>
            <td className="px-3 py-2">{r.guestCount}</td>
            <td className="px-3 py-2">
              <Link className="text-blue-700 mr-3" to={r.id}>Edit</Link>
              <button className="text-red-700" onClick={()=>removeById('events', r.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}

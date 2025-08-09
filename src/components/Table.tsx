import { ReactNode } from 'react'
export default function Table({ thead, children }: { thead: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">{thead}</thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  )
}

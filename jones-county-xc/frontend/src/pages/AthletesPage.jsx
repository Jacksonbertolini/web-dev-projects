import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { API_BASE } from '@/lib/api'

async function fetchAthletes() {
  const res = await fetch(`${API_BASE}/athletes`)
  if (!res.ok) throw new Error('Failed to fetch athletes')
  return res.json()
}

function toSeconds(t) {
  if (!t) return Infinity
  return t.split(':').reduce((acc, val) => acc * 60 + parseInt(val), 0)
}

export default function AthletesPage() {
  const [search, setSearch] = useState('')

  const { data: athletes = [], isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  if (isLoading) {
    return (
      <div role="status" className="container mx-auto px-4 py-12 text-center text-gray-500">
        Loading team roster...
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="container mx-auto px-4 py-12 text-center text-red-600">
        Error: {error.message}
      </div>
    )
  }

  const sorted = [...athletes].sort((a, b) => toSeconds(a.personal_record) - toSeconds(b.personal_record))
  const bestId = sorted[0]?.id

  const filtered = sorted.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    String(a.grade).includes(search)
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Athletes <span className="text-gray-400 font-normal text-lg">({athletes.length})</span>
        </h2>
        <input
          type="search"
          placeholder="Search by name or grade…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search athletes by name or grade"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide border-b border-gray-200">
              <th className="px-4 py-3 text-left w-12">Rank</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left w-20">Grade</th>
              <th className="px-4 py-3 text-left">Personal Record</th>
              <th className="px-4 py-3 text-left">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((athlete, i) => (
              <tr key={athlete.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{athlete.name}</span>
                    {athlete.id === bestId && (
                      <span
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold"
                        aria-label="Team best time"
                      >
                        Team best
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{athlete.grade}</td>
                <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                  {athlete.personal_record ?? <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {athlete.events ?? <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  No athletes match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

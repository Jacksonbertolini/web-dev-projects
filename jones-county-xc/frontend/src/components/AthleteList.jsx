import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { API_BASE } from '@/lib/api'

async function fetchAthletes() {
  const response = await fetch(`${API_BASE}/athletes`)
  if (!response.ok) {
    throw new Error('Failed to fetch athletes')
  }
  return response.json()
}

export default function AthleteList() {
  const queryClient = useQueryClient()
  const { data: athletes, isLoading, isFetching, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ['athletes'] })
  }

  if (isLoading) {
    return <div role="status">Loading team roster...</div>
  }

  if (error) {
    return <div role="alert">Error: {error.message}</div>
  }

  const sorted = [...athletes].sort((a, b) => {
    const toSeconds = (t) => t.split(':').reduce((acc, val) => acc * 60 + parseInt(val), 0)
    return toSeconds(a.personal_record) - toSeconds(b.personal_record)
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Team Roster ({athletes.length} athletes)
        </h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
          {isFetching ? 'Refreshing...' : 'Refresh Athletes'}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((athlete) => (
          <div key={athlete.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{athlete.name}</h3>
              <p className="text-sm text-gray-500">Grade {athlete.grade}</p>
            </div>
            <div className="mb-4">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Personal Record</span>
              <p className="text-2xl font-bold text-blue-600">{athlete.personal_record}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full" aria-label={`View profile for ${athlete.name}`}>
              View Profile
            </Button>
          </div>
        ))}
      </div>
    </main>
  )
}

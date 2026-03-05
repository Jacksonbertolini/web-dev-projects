import { useQuery } from '@tanstack/react-query'
import { API_BASE } from '@/lib/api'

async function fetchMeets() {
  const response = await fetch(`${API_BASE}/meets`)
  if (!response.ok) {
    throw new Error('Failed to fetch meets')
  }
  return response.json()
}

export default function MeetsList() {
  const { data: meets, isLoading, error } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  if (isLoading) {
    return <div role="status">Loading meets...</div>
  }

  if (error) {
    return <div role="alert">Error: {error.message}</div>
  }

  return (
    <section aria-label="Upcoming Meets" className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upcoming Meets ({meets.length})
      </h2>
      <ul className="space-y-3">
        {meets.map((meet) => (
          <li key={meet.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
            <p className="font-semibold text-gray-900">{meet.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(meet.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {meet.location}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

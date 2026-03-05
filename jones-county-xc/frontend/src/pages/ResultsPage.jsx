import { useQuery } from '@tanstack/react-query'
import { API_BASE } from '@/lib/api'

async function fetchAll() {
  const [meetsRes, resultsRes, athletesRes] = await Promise.all([
    fetch(`${API_BASE}/meets`),
    fetch(`${API_BASE}/results`),
    fetch(`${API_BASE}/athletes`),
  ])
  if (!meetsRes.ok || !resultsRes.ok || !athletesRes.ok) {
    throw new Error('Failed to fetch results data')
  }
  const [meets, results, athletes] = await Promise.all([
    meetsRes.json(),
    resultsRes.json(),
    athletesRes.json(),
  ])
  return { meets, results, athletes }
}

const medalColors = {
  1: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', label: '🥇' },
  2: { bg: 'bg-gray-50',   border: 'border-gray-300',   text: 'text-gray-600',   label: '🥈' },
  3: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600',  label: '🥉' },
}

export default function ResultsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['results-combined'],
    queryFn: fetchAll,
  })

  if (isLoading) {
    return (
      <div role="status" className="container mx-auto px-4 py-12 text-center text-gray-500">
        Loading results…
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

  const { meets, results, athletes } = data

  const athleteMap = Object.fromEntries(athletes.map((a) => [a.id, a]))

  // Group results by meet_id
  const resultsByMeet = results.reduce((acc, r) => {
    if (!acc[r.meet_id]) acc[r.meet_id] = []
    acc[r.meet_id].push(r)
    return acc
  }, {})

  // Only show meets that have results, sorted by date descending
  const meetsWithResults = meets
    .filter((m) => resultsByMeet[m.id]?.length > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (meetsWithResults.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 text-center text-gray-400">
        No results recorded yet.
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Results</h2>

      <div className="space-y-10">
        {meetsWithResults.map((meet) => {
          const meetResults = [...(resultsByMeet[meet.id] ?? [])].sort(
            (a, b) => (a.place ?? 999) - (b.place ?? 999)
          )

          return (
            <section key={meet.id} aria-label={`Results for ${meet.name}`}>
              <div className="mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{meet.name}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(meet.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {meet.location && ` · ${meet.location}`}
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide border-b border-gray-200">
                      <th className="px-4 py-3 text-left w-16">Place</th>
                      <th className="px-4 py-3 text-left">Athlete</th>
                      <th className="px-4 py-3 text-left w-20">Grade</th>
                      <th className="px-4 py-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {meetResults.map((result) => {
                      const athlete = athleteMap[result.athlete_id]
                      const medal = medalColors[result.place]

                      return (
                        <tr
                          key={result.id}
                          className={`transition-colors ${medal ? medal.bg : 'bg-white hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3">
                            {medal ? (
                              <span className={`font-bold ${medal.text}`} aria-label={`Place ${result.place}`}>
                                {medal.label} {result.place}
                              </span>
                            ) : (
                              <span className="text-gray-500">{result.place ?? '—'}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {athlete?.name ?? `Athlete #${result.athlete_id}`}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {athlete?.grade ?? '—'}
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                            {result.time}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}

import { useQuery } from '@tanstack/react-query'
import { API_BASE } from '@/lib/api'

async function fetchMeets() {
  const res = await fetch(`${API_BASE}/meets`)
  if (!res.ok) throw new Error('Failed to fetch meets')
  return res.json()
}

function MeetBadge({ date }) {
  const isPast = new Date(date) < new Date()
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isPast
          ? 'bg-gray-100 text-gray-500'
          : 'bg-green-100 text-green-700'
      }`}
      aria-label={isPast ? 'Past meet' : 'Upcoming meet'}
    >
      {isPast ? 'Past' : 'Upcoming'}
    </span>
  )
}

export default function SchedulePage() {
  const { data: meets = [], isLoading, error } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  if (isLoading) {
    return (
      <div role="status" className="container mx-auto px-4 py-12 text-center text-gray-500">
        Loading schedule…
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

  const sorted = [...meets].sort((a, b) => new Date(a.date) - new Date(b.date))
  const upcoming = sorted.filter((m) => new Date(m.date) >= new Date())
  const past = sorted.filter((m) => new Date(m.date) < new Date())

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Season Schedule <span className="text-gray-400 font-normal text-lg">({meets.length} meets)</span>
      </h2>

      {upcoming.length > 0 && (
        <section aria-label="Upcoming meets" className="mb-10">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Upcoming
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section aria-label="Past meets">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Past
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        </section>
      )}

      {meets.length === 0 && (
        <p className="text-gray-400 text-center py-12">No meets scheduled yet.</p>
      )}
    </main>
  )
}

function MeetCard({ meet }) {
  const isPast = new Date(meet.date) < new Date()

  return (
    <article
      className={`rounded-lg border p-5 shadow-sm transition-colors ${
        isPast ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-semibold text-gray-900 leading-snug">{meet.name}</h4>
        <MeetBadge date={meet.date} />
      </div>
      <p className="text-sm text-gray-600">
        {new Date(meet.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      {meet.location && (
        <p className="text-sm text-gray-400 mt-1">{meet.location}</p>
      )}
      {meet.description && (
        <p className="text-sm text-gray-500 mt-2 border-t border-gray-100 pt-2">
          {meet.description}
        </p>
      )}
    </article>
  )
}

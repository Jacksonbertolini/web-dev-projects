import { useQuery } from '@tanstack/react-query'

async function fetchAthletes() {
  const response = await fetch('/module2/api/athletes')
  if (!response.ok) {
    throw new Error('Failed to fetch athletes')
  }
  return response.json()
}

export default function AthleteList() {
  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  if (isLoading) {
    return <div>Loading athletes...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h2>Athletes</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Grade</th>
            <th>Personal Record</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id}>
              <td>{athlete.name}</td>
              <td>{athlete.grade}</td>
              <td>{athlete.personalRecord}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import WelcomeBanner from '@/components/WelcomeBanner'
import AthleteList from '@/components/AthleteList'
import MeetsList from '@/components/MeetsList'

export default function HomePage() {
  return (
    <>
      <WelcomeBanner />
      <AthleteList />
      <MeetsList />
    </>
  )
}

import Header from './components/Header'
import WelcomeBanner from './components/WelcomeBanner'
import AthleteList from './components/AthleteList'
import MeetsList from './components/MeetsList'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WelcomeBanner />
      <AthleteList />
      <MeetsList />
    </div>
  )
}

export default App

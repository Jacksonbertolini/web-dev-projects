import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import HomePage from '@/pages/HomePage'
import AthletesPage from '@/pages/AthletesPage'
import SchedulePage from '@/pages/SchedulePage'
import ResultsPage from '@/pages/ResultsPage'
import LoginPage from '@/pages/LoginPage'
import AdminPage from '@/pages/AdminPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App

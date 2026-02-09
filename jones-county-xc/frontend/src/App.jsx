import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Jones County XC</h1>
          <p className="text-lg text-gray-600">Hello World - Module 1 Deployment</p>
        </div>
      </main>
    </div>
  )
}

export default App

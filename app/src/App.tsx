import './App.css'
import { Configs } from './components/layout/Configs'
import { Dashboard } from './components/layout/Dashboard'
import { Sidebar } from './components/layout/Sidebar'

function App() {
  return (
    <>
      <div className='grid grid-cols-[auto_1fr_auto]'>
        <Sidebar />
        <Dashboard />
        <Configs />
      </div>
    </>
  )
}

export default App

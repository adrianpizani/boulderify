import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import UploadBoulder from './pages/UploadBoulder'
import MyBoulders from './pages/MyBoulders'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadBoulder />} />
      <Route path="/myboulders" element={<MyBoulders />} />
      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App

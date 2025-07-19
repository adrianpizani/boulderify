import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import UploadBoulder from './pages/UploadBoulder'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadBoulder />} />
    </Routes>
  )
}

export default App

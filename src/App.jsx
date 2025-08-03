import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './store/index.jsx'
import Home from './pages/Home'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </StoreProvider>
  )
}

export default App

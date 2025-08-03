import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { StoreProvider } from './store/index.jsx'
import Home from './pages/Home'
import About from './pages/About'
import AntdDemo from './components/AntdDemo'
import './App.css'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <StoreProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/demo" element={<AntdDemo />} />
            </Routes>
          </div>
        </Router>
      </StoreProvider>
    </ConfigProvider>
  )
}

export default App

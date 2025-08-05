import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { StoreProvider } from '@/store/index.jsx'
import RouterConfig from '@/router/RouterConfig'
import '@/App.css'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <StoreProvider>
        <Router>
          <div className="App">
            <RouterConfig />
          </div>
        </Router>
      </StoreProvider>
    </ConfigProvider>
  )
}

export default App

import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { StoreProvider } from '@/store/StoreProvider.jsx'
import ZustandProvider from '@/store/zustand/ZustandProvider'
import RouterConfig from '@/router/RouterConfig'
import '@/App.css'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <StoreProvider>
        <ZustandProvider>
          <Router>
            <div className="App">
              <RouterConfig />
            </div>
          </Router>
        </ZustandProvider>
      </StoreProvider>
    </ConfigProvider>
  )
}

export default App

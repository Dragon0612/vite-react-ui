import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { StoreProvider } from '@/store/index.jsx'
import RouterConfig from '@/router/RouterConfig'
import '@/App.css'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
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

import AppProvider from '@/providers/AppProvider'
import RouterConfig from '@/router/RouterConfig'
import ResourcePreloader from '@/components/ResourcePreloader'
import '@/App.css'

// 初始化全局性能监控
import '@/services/performanceMonitor'

function App() {
  return (
    <AppProvider>
      <div className="App">
        <ResourcePreloader />
        <RouterConfig />
      </div>
    </AppProvider>
  )
}

export default App

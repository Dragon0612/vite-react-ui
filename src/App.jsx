import AppProvider from '@/providers/AppProvider'
import RouterConfig from '@/router/RouterConfig'
import ResourcePreloader from '@/components/ResourcePreloader'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import '@/App.css'

function App() {
  return (
    <AppProvider>
      <div className="App">
        <ResourcePreloader />
        <RouterConfig />
        <PerformanceMonitor />
      </div>
    </AppProvider>
  )
}

export default App

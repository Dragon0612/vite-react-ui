import AppProvider from '@/providers/AppProvider'
import RouterConfig from '@/router/RouterConfig'
import '@/App.css'

function App() {
  return (
    <AppProvider>
      <div className="App">
        <RouterConfig />
      </div>
    </AppProvider>
  )
}

export default App

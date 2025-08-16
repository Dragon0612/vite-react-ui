import React, { createContext, useContext, useMemo, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import { store } from '@/store/index.jsx'
import { useKeepAliveTestStore } from '@/store/zustand/keepAliveTestStore'

// 用户信息Context
const UserContext = createContext()

// 用户信息Provider
const UserProvider = ({ children }) => {
  const userInfo = useMemo(() => {
    const permissions = localStorage.getItem('permissions')
    return {
      id: localStorage.getItem('userId') || '1',
      username: localStorage.getItem('username') || 'admin',
      role: localStorage.getItem('userRole') || 'admin',
      permissions: permissions ? JSON.parse(permissions) : []
    }
  }, [])

  return (
    <UserContext.Provider value={userInfo}>
      {children}
    </UserContext.Provider>
  )
}

// 用户信息Hook
export const useUserInfo = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserInfo must be used within UserProvider')
  }
  return context
}

// Zustand初始化组件
const ZustandInitializer = ({ children }) => {
  useEffect(() => {
    // 预加载 KeepAliveTest store
    const store = useKeepAliveTestStore.getState()
    
    console.log('🚀 Zustand 状态管理已初始化', {
      store: 'KeepAliveTest',
      state: store
    })
    
    // 在开发环境下启用调试
    if (process.env.NODE_ENV === 'development') {
      window.__zustandStores = {
        keepAliveTest: useKeepAliveTestStore
      }
      console.log('🔧 Zustand 调试模式已启用')
    }
  }, [])

  return <>{children}</>
}

// 统一的App Provider
const AppProvider = ({ children }) => {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <ZustandInitializer>
          <UserProvider>
            <Router>
              {children}
            </Router>
          </UserProvider>
        </ZustandInitializer>
      </Provider>
    </ConfigProvider>
  )
}

export default AppProvider

import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useUserStore, useSettingsStore } from '@/store/zustand'

// Zustand初始化组件
const ZustandInitializer = ({ children }) => {
  const { initializeUserInfo } = useUserStore()
  
  useEffect(() => {
    // 初始化用户信息
    initializeUserInfo()
    
    console.log('🚀 Zustand 状态管理已初始化', {
      userStore: useUserStore.getState(),
      settingsStore: useSettingsStore.getState()
    })
    
    // 在开发环境下启用调试
    if (process.env.NODE_ENV === 'development') {
      window.__zustandStores = {
        user: useUserStore,
        settings: useSettingsStore
      }
      console.log('🔧 Zustand 调试模式已启用，可通过 window.__zustandStores 访问')
    }
  }, [initializeUserInfo])

  return <>{children}</>
}

// 统一的App Provider
const AppProvider = ({ children }) => {
  return (
    <ConfigProvider locale={zhCN}>
      <ZustandInitializer>
        <Router>
          {children}
        </Router>
      </ZustandInitializer>
    </ConfigProvider>
  )
}

export default AppProvider

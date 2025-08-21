import React from 'react'

/**
 * Zustand 提供者组件
 * 用于在应用根级别提供 Zustand 状态管理
 */
const ZustandProvider = ({ children }) => {
  // 初始化所有 Zustand stores
  React.useEffect(() => {
    console.log('🚀 Zustand 状态管理已初始化')
    
    // 在开发环境下启用调试
    if (process.env.NODE_ENV === 'development') {
      // 将 store 挂载到 window 对象，方便调试
      window.__zustandStores = {}
      
      console.log('🔧 Zustand 调试模式已启用，可通过 window.__zustandStores 访问')
    }
  }, [])

  return <>{children}</>
}

export default ZustandProvider

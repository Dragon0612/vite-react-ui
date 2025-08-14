// Zustand 工具函数
import { useKeepAliveTestStore } from './keepAliveTestStore'

/**
 * 调试工具：打印当前状态
 */
export const debugStore = () => {
  const state = useKeepAliveTestStore.getState()
  console.log('🔍 KeepAliveTest Store 当前状态:', state)
  return state
}

/**
 * 监控状态变化
 */
export const subscribeToStore = (callback) => {
  return useKeepAliveTestStore.subscribe(callback)
}

/**
 * 获取状态快照
 */
export const getStoreSnapshot = () => {
  return useKeepAliveTestStore.getState()
}

/**
 * 清理 Store 数据
 */
export const clearStoreData = () => {
  useKeepAliveTestStore.getState().resetAllData()
  console.log('🧹 Store 数据已清理')
}

/**
 * 导出状态数据（用于调试）
 */
export const exportStoreData = () => {
  const state = getStoreSnapshot()
  const dataStr = JSON.stringify(state, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `keep-alive-test-state-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  console.log('📤 Store 数据已导出')
}

/**
 * 导入状态数据（用于调试）
 */
export const importStoreData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData)
    const { setTestData, setPageLoads, setLastVisit } = useKeepAliveTestStore.getState()
    
    if (data.testData) {
      Object.entries(data.testData).forEach(([key, value]) => {
        setTestData(key, value)
      })
    }
    
    if (data.pageLoads !== undefined) {
      setPageLoads(data.pageLoads)
    }
    
    if (data.lastVisit) {
      setLastVisit(data.lastVisit)
    }
    
    console.log('📥 Store 数据已导入')
    return true
  } catch (error) {
    console.error('❌ 导入数据失败:', error)
    return false
  }
}

/**
 * 性能监控：测量状态更新性能
 */
export const measureStorePerformance = (actionName, action) => {
  const startTime = performance.now()
  const result = action()
  const endTime = performance.now()
  
  console.log(`⚡ ${actionName} 执行耗时: ${(endTime - startTime).toFixed(2)}ms`)
  return result
}

/**
 * 状态验证：检查状态是否有效
 */
export const validateStoreState = () => {
  const state = getStoreSnapshot()
  const errors = []
  
  // 验证计数器
  if (typeof state.testData.counter !== 'number' || state.testData.counter < 0) {
    errors.push('计数器值无效')
  }
  
  // 验证时间戳
  if (typeof state.testData.timestamp !== 'number' || state.testData.timestamp <= 0) {
    errors.push('时间戳无效')
  }
  
  // 验证随机数
  if (typeof state.testData.randomNumber !== 'number' || state.testData.randomNumber < 0) {
    errors.push('随机数无效')
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ Store 状态验证失败:', errors)
    return false
  }
  
  console.log('✅ Store 状态验证通过')
  return true
}

/**
 * 自动保存提示
 */
export const showAutoSaveStatus = () => {
  const state = getStoreSnapshot()
  const lastSaveTime = new Date().toLocaleTimeString()
  
  console.log(`💾 状态已自动保存 (${lastSaveTime}):`, {
    计数器: state.testData.counter,
    输入内容: state.testData.inputValue,
    页面加载次数: state.pageLoads
  })
}

// 自动监控状态变化
if (process.env.NODE_ENV === 'development') {
  subscribeToStore((state, prevState) => {
    console.log('🔄 Store 状态变化:', {
      之前: prevState,
      现在: state,
      变化: Object.keys(state).filter(key => state[key] !== prevState[key])
    })
  })
}

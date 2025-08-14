// Zustand 自定义 Hooks
import { useKeepAliveTestStore } from './keepAliveTestStore'
import { useCallback, useMemo } from 'react'

/**
 * 使用 KeepAliveTest 完整状态
 */
export const useKeepAliveTest = () => {
  return useKeepAliveTestStore()
}

/**
 * 使用测试数据状态
 */
export const useTestData = () => {
  return useKeepAliveTestStore(state => state.testData)
}

/**
 * 使用计数器状态
 */
export const useCounter = () => {
  return useKeepAliveTestStore(state => state.testData.counter)
}

/**
 * 使用输入值状态
 */
export const useInputValue = () => {
  return useKeepAliveTestStore(state => state.testData.inputValue)
}

/**
 * 使用页面加载次数
 */
export const usePageLoads = () => {
  return useKeepAliveTestStore(state => state.pageLoads)
}

/**
 * 使用最后访问时间
 */
export const useLastVisit = () => {
  return useKeepAliveTestStore(state => state.lastVisit)
}

/**
 * 使用 KeepAlive 状态
 */
export const useKeepAliveStatus = () => {
  return useKeepAliveTestStore(state => state.keepAliveStatus)
}

/**
 * 使用操作方法
 */
export const useKeepAliveTestActions = () => {
  const {
    updateTestData,
    incrementCounter,
    resetData,
    setPageLoads,
    setLastVisit,
    setKeepAliveStatus,
    updateMultipleData,
    generateNewRandomNumber,
    resetAllData
  } = useKeepAliveTestStore()

  // 使用 useCallback 优化性能
  const memoizedActions = useMemo(() => ({
    updateTestData: useCallback(updateTestData, []),
    incrementCounter: useCallback(incrementCounter, []),
    resetData: useCallback(resetData, []),
    setPageLoads: useCallback(setPageLoads, []),
    setLastVisit: useCallback(setLastVisit, []),
    setKeepAliveStatus: useCallback(setKeepAliveStatus, []),
    updateMultipleData: useCallback(updateMultipleData, []),
    generateNewRandomNumber: useCallback(generateNewRandomNumber, []),
    resetAllData: useCallback(resetAllData, [])
  }), [])

  return memoizedActions
}

/**
 * 使用特定操作方法
 */
export const useUpdateTestData = () => {
  return useKeepAliveTestStore(state => state.updateTestData)
}

export const useIncrementCounter = () => {
  return useKeepAliveTestStore(state => state.incrementCounter)
}

export const useResetData = () => {
  return useKeepAliveTestStore(state => state.resetData)
}

/**
 * 使用状态选择器（高性能）
 */
export const useTestDataSelector = (selector) => {
  return useKeepAliveTestStore(selector)
}

/**
 * 使用状态比较器（避免不必要的重渲染）
 */
export const useTestDataWithComparator = (comparator) => {
  return useKeepAliveTestStore(
    state => state.testData,
    comparator
  )
}

/**
 * 使用状态订阅（用于副作用）
 */
export const useTestDataSubscription = (callback) => {
  const subscribe = useKeepAliveTestStore.subscribe
  
  useMemo(() => {
    const unsubscribe = subscribe(callback)
    return unsubscribe
  }, [subscribe, callback])
}

/**
 * 组合 Hook：使用测试数据和操作
 */
export const useKeepAliveTestCombined = () => {
  const testData = useTestData()
  const actions = useKeepAliveTestActions()
  const pageLoads = usePageLoads()
  const lastVisit = useLastVisit()
  const keepAliveStatus = useKeepAliveStatus()

  return {
    // 状态
    testData,
    pageLoads,
    lastVisit,
    keepAliveStatus,
    
    // 操作方法
    ...actions,
    
    // 计算属性
    isDataEmpty: !testData.inputValue && testData.counter === 0,
    dataSummary: {
      counter: testData.counter,
      clicks: testData.clicks,
      hasInput: !!testData.inputValue,
      randomNumber: testData.randomNumber
    }
  }
}

/**
 * 使用状态持久化信息
 */
export const useStorePersistence = () => {
  const store = useKeepAliveTestStore
  
  return {
    // 检查是否支持持久化
    isPersisted: true,
    
    // 获取存储键名
    storageKey: 'keep-alive-test-storage',
    
    // 手动触发持久化
    persist: () => {
      // Zustand 自动处理，这里只是接口
      console.log('💾 状态已自动持久化')
    },
    
    // 清除持久化数据
    clearPersistence: () => {
      localStorage.removeItem('keep-alive-test-storage')
      console.log('🗑️ 持久化数据已清除')
    }
  }
}

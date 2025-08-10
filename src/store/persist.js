// 简单的状态持久化工具
export const persistState = {
  // 保存状态到 localStorage
  save: (key, state) => {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(key, serializedState)
    } catch (error) {
      console.warn('状态保存失败:', error)
    }
  },

  // 从 localStorage 加载状态
  load: (key, defaultValue = {}) => {
    try {
      const serializedState = localStorage.getItem(key)
      if (serializedState === null) {
        return defaultValue
      }
      return JSON.parse(serializedState)
    } catch (error) {
      console.warn('状态加载失败:', error)
      return defaultValue
    }
  },

  // 清除特定状态
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('状态清除失败:', error)
    }
  },

  // 清除所有状态
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('状态清除失败:', error)
    }
  }
}

// 自动保存中间件
export const createPersistMiddleware = (keys = []) => {
  return (store) => (next) => (action) => {
    const result = next(action)
    
    // 在状态更新后自动保存
    keys.forEach(key => {
      if (store.getState()[key]) {
        persistState.save(key, store.getState()[key])
      }
    })
    
    return result
  }
}

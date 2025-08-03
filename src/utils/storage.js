// 本地存储工具函数
export const storage = {
  // 设置数据
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  // 获取数据
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  // 清空所有数据
  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  // 检查是否存在
  has(key) {
    return localStorage.getItem(key) !== null
  }
}

// 会话存储工具函数
export const sessionStorage = {
  // 设置数据
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      window.sessionStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error saving to sessionStorage:', error)
    }
  },

  // 获取数据
  get(key, defaultValue = null) {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue
    }
  },

  // 删除数据
  remove(key) {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
    }
  },

  // 清空所有数据
  clear() {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
  },

  // 检查是否存在
  has(key) {
    return window.sessionStorage.getItem(key) !== null
  }
} 
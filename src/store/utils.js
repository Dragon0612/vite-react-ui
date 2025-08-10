import { persistState } from './persist.js'

// 状态管理工具函数
export const stateUtils = {
  // 获取所有持久化状态
  getAllPersistedState: () => {
    const keys = ['user', 'settings']
    const state = {}
    
    keys.forEach(key => {
      state[key] = persistState.load(key, {})
    })
    
    return state
  },
  
  // 清除所有持久化状态
  clearAllPersistedState: () => {
    persistState.clear()
  },
  
  // 导出状态到文件
  exportState: () => {
    const state = stateUtils.getAllPersistedState()
    const dataStr = JSON.stringify(state, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `app-state-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  },
  
  // 从文件导入状态
  importState: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const state = JSON.parse(e.target.result)
          
          // 验证状态结构
          if (state.user && state.settings) {
            // 保存到 localStorage
            Object.keys(state).forEach(key => {
              persistState.save(key, state[key])
            })
            resolve(state)
          } else {
            reject(new Error('无效的状态文件格式'))
          }
        } catch (error) {
          reject(new Error('文件解析失败'))
        }
      }
      
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  },
  
  // 状态迁移（版本升级时使用）
  migrateState: (fromVersion, toVersion) => {
    console.log(`状态迁移: ${fromVersion} -> ${toVersion}`)
    
    // 这里可以添加版本迁移逻辑
    // 例如：重新组织状态结构、添加新字段等
    
    return true
  },
  
  // 获取状态统计信息
  getStateStats: () => {
    const state = stateUtils.getAllPersistedState()
    const stats = {
      totalKeys: 0,
      totalSize: 0,
      lastModified: null
    }
    
    Object.keys(state).forEach(key => {
      const data = JSON.stringify(state[key])
      stats.totalKeys += Object.keys(state[key]).length
      stats.totalSize += new Blob([data]).size
      
      const item = localStorage.getItem(key)
      if (item) {
        const timestamp = new Date().getTime()
        if (!stats.lastModified || timestamp > stats.lastModified) {
          stats.lastModified = timestamp
        }
      }
    })
    
    return stats
  }
}

// 状态验证工具
export const stateValidation = {
  // 验证用户状态
  validateUserState: (state) => {
    const required = ['user', 'token', 'isLoggedIn', 'theme', 'language']
    return required.every(key => key in state)
  },
  
  // 验证设置状态
  validateSettingsState: (state) => {
    const required = ['sidebarCollapsed', 'breadcrumbVisible', 'pageSize', 'autoSave']
    return required.every(key => key in state)
  },
  
  // 验证完整状态
  validateAllState: (state) => {
    return {
      user: stateValidation.validateUserState(state.user || {}),
      settings: stateValidation.validateSettingsState(state.settings || {})
    }
  }
}

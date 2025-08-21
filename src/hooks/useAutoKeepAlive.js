import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 自动状态持久化Hook
 * 用法：只需将 useState 替换为 useAutoState 即可自动持久化
 */

// 全局状态管理器
class AutoKeepAliveManager {
  constructor() {
    this.stores = new Map() // 存储每个页面的状态
    this.listeners = new Map() // 状态监听器
  }

  // 获取页面存储key
  getPageKey(pathname, cacheKey) {
    return cacheKey || `auto-keepalive-${pathname.replace(/\//g, '-')}`
  }

  // 保存页面状态
  savePageState(pageKey, stateKey, value) {
    const currentState = this.getPageState(pageKey)
    const newState = { ...currentState, [stateKey]: value }
    
    localStorage.setItem(pageKey, JSON.stringify(newState))
    this.stores.set(pageKey, newState)
    
    // 通知监听器
    const listeners = this.listeners.get(pageKey) || []
    listeners.forEach(listener => listener(newState))
  }

  // 获取页面状态
  getPageState(pageKey) {
    if (this.stores.has(pageKey)) {
      return this.stores.get(pageKey)
    }
    
    try {
      const saved = localStorage.getItem(pageKey)
      const state = saved ? JSON.parse(saved) : {}
      this.stores.set(pageKey, state)
      return state
    } catch (error) {
      console.warn('AutoKeepAlive: 解析状态失败', error)
      return {}
    }
  }

  // 清除页面状态
  clearPageState(pageKey) {
    this.stores.delete(pageKey)
    localStorage.removeItem(pageKey)
    
    // 通知监听器
    const listeners = this.listeners.get(pageKey) || []
    listeners.forEach(listener => listener({}))
  }

  // 添加状态监听器
  addListener(pageKey, listener) {
    if (!this.listeners.has(pageKey)) {
      this.listeners.set(pageKey, [])
    }
    this.listeners.get(pageKey).push(listener)
  }

  // 移除状态监听器
  removeListener(pageKey, listener) {
    const listeners = this.listeners.get(pageKey) || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

// 全局实例
const autoKeepAliveManager = new AutoKeepAliveManager()

/**
 * 自动持久化的useState Hook
 * @param {*} initialValue 初始值
 * @param {string} stateKey 状态唯一标识
 * @param {object} options 配置选项
 * @returns {[value, setter]}
 */
export const useAutoState = (initialValue, stateKey, options = {}) => {
  const location = useLocation()
  const { 
    cacheKey, 
    disabled = false,
    onRestore = null,
    onSave = null 
  } = options

  const pageKey = autoKeepAliveManager.getPageKey(location.pathname, cacheKey)
  const isInitialized = useRef(false)

  // 获取保存的值或使用初始值
  const getSavedValue = useCallback(() => {
    if (disabled) return initialValue
    
    const pageState = autoKeepAliveManager.getPageState(pageKey)
    const savedValue = pageState[stateKey]
    
    if (savedValue !== undefined) {
      console.log(`🔄 AutoKeepAlive: 恢复状态 ${stateKey}:`, savedValue)
      onRestore?.(savedValue)
      return savedValue
    }
    
    return initialValue
  }, [pageKey, stateKey, initialValue, disabled, onRestore])

  const [value, setValue] = useState(getSavedValue)

  // 自动保存状态
  const setAutoValue = useCallback((newValue) => {
    const finalValue = typeof newValue === 'function' ? newValue(value) : newValue
    
    setValue(finalValue)
    
    if (!disabled) {
      autoKeepAliveManager.savePageState(pageKey, stateKey, finalValue)
      console.log(`💾 AutoKeepAlive: 保存状态 ${stateKey}:`, finalValue)
      onSave?.(finalValue)
    }
  }, [pageKey, stateKey, value, disabled, onSave])

  // 初始化时恢复状态
  useEffect(() => {
    if (!isInitialized.current && !disabled) {
      const savedValue = getSavedValue()
      if (savedValue !== value) {
        setValue(savedValue)
      }
      isInitialized.current = true
    }
  }, [getSavedValue, value, disabled])

  return [value, setAutoValue]
}

/**
 * 页面状态管理Hook
 * 提供页面级别的状态管理功能
 */
export const usePageState = (options = {}) => {
  const location = useLocation()
  const { cacheKey } = options
  const pageKey = autoKeepAliveManager.getPageKey(location.pathname, cacheKey)

  const clearPageState = useCallback(() => {
    autoKeepAliveManager.clearPageState(pageKey)
    console.log(`🧹 AutoKeepAlive: 清除页面状态 ${pageKey}`)
  }, [pageKey])

  const getPageState = useCallback(() => {
    return autoKeepAliveManager.getPageState(pageKey)
  }, [pageKey])

  const getPageInfo = useCallback(() => {
    const state = getPageState()
    return {
      pageKey,
      pathname: location.pathname,
      stateKeys: Object.keys(state),
      stateCount: Object.keys(state).length,
      state
    }
  }, [pageKey, location.pathname, getPageState])

  return {
    clearPageState,
    getPageState,
    getPageInfo,
    pageKey
  }
}

/**
 * 简化的自动状态Hook
 * 自动生成stateKey，更简单的使用方式
 */
export const useKeepState = (initialValue, options = {}) => {
  const stateKey = useRef(options.key || `state-${Math.random().toString(36).substr(2, 9)}`)
  return useAutoState(initialValue, stateKey.current, options)
}

/**
 * 表单状态管理Hook
 * 专门用于表单数据的自动持久化
 */
export const useFormState = (initialFormData = {}, options = {}) => {
  const [formData, setFormData] = useAutoState(initialFormData, 'formData', options)

  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }, [setFormData])

  const updateFields = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [setFormData])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
  }, [setFormData, initialFormData])

  const getField = useCallback((fieldName) => {
    return formData[fieldName]
  }, [formData])

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    getField
  }
}

// 导出管理器实例（用于调试）
export const getAutoKeepAliveManager = () => autoKeepAliveManager

// 全局清理函数
export const clearAllAutoStates = () => {
  const keys = Object.keys(localStorage).filter(key => key.startsWith('auto-keepalive-'))
  keys.forEach(key => localStorage.removeItem(key))
  autoKeepAliveManager.stores.clear()
  console.log('🧹 AutoKeepAlive: 清除所有自动状态')
}

export default useAutoState

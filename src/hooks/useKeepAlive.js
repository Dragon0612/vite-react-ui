import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useKeepAliveTestStore } from '@/store/zustand'

/**
 * KeepAlive 自定义 Hook
 * @returns {Object} keepAlive 相关方法和状态
 */
export const useKeepAlive = () => {
  const location = useLocation()
  const currentPath = location.pathname
  
  // 使用Zustand store
  const {
    testData,
    pageLoads,
    lastVisit,
    keepAliveStatus,
    updateTestData,
    setPageLoads,
    setLastVisit,
    setKeepAliveStatus,
    getCurrentState
  } = useKeepAliveTestStore()

  // 判断当前页面是否被缓存（简化版本）
  const isCached = useCallback((path = currentPath) => {
    // 这里可以根据实际需求实现缓存判断逻辑
    return pageLoads > 0
  }, [pageLoads, currentPath])

  // 判断当前页面是否活跃
  const isActive = useCallback((path = currentPath) => {
    return lastVisit && (Date.now() - lastVisit) < 30000 // 30秒内认为是活跃的
  }, [lastVisit, currentPath])

  // 添加页面到缓存
  const cachePage = useCallback((path, metadata = {}) => {
    setPageLoads(pageLoads + 1)
    setLastVisit(Date.now())
    setKeepAliveStatus('已缓存')
    console.log(`页面已缓存: ${path}`, metadata)
  }, [pageLoads, setPageLoads, setLastVisit, setKeepAliveStatus])

  // 从缓存中移除页面
  const removePage = useCallback((path) => {
    setPageLoads(0)
    setLastVisit(null)
    setKeepAliveStatus('已移除')
    console.log(`页面已移除: ${path}`)
  }, [setPageLoads, setLastVisit, setKeepAliveStatus])

  // 清空所有缓存
  const clearCache = useCallback(() => {
    setPageLoads(0)
    setLastVisit(null)
    setKeepAliveStatus('已清空')
    console.log('所有缓存已清空')
  }, [setPageLoads, setLastVisit, setKeepAliveStatus])

  // 激活页面
  const activatePageHandler = useCallback((path) => {
    setLastVisit(Date.now())
    setKeepAliveStatus('已激活')
    console.log(`页面已激活: ${path}`)
  }, [setLastVisit, setKeepAliveStatus])

  // 更新配置
  const updateConfigHandler = useCallback((newConfig) => {
    updateTestData('config', newConfig)
    console.log('配置已更新:', newConfig)
  }, [updateTestData])

  // 设置最大缓存数量
  const setMaxCacheHandler = useCallback((maxCache) => {
    updateTestData('maxCache', maxCache)
    console.log(`最大缓存数量已设置为: ${maxCache}`)
  }, [updateTestData])

  // 获取缓存统计信息
  const getCacheStats = useCallback(() => {
    return {
      totalCached: pageLoads,
      activePages: isActive() ? 1 : 0,
      maxCache: testData.maxCache || 10,
      cachedPaths: isCached() ? [currentPath] : [],
      activePaths: isActive() ? [currentPath] : [],
      currentPath,
      isCurrentCached: isCached(),
      isCurrentActive: isActive(),
      status: keepAliveStatus
    }
  }, [pageLoads, isActive, testData.maxCache, currentPath, isCached, keepAliveStatus])

  // 预加载页面
  const preloadPage = useCallback((path) => {
    if (!isCached(path)) {
      console.log(`预加载页面: ${path}`)
      // 这里可以实现预加载逻辑
    }
  }, [isCached])

  // 自动激活当前页面
  useEffect(() => {
    if (isCached()) {
      activatePageHandler(currentPath)
    }
  }, [currentPath, isCached, activatePageHandler])

  // 自动缓存当前页面
  useEffect(() => {
    const shouldCache = !currentPath.includes('/login') && !currentPath.includes('/error')
    
    if (shouldCache && !isCached()) {
      cachePage(currentPath, {
        title: document.title,
        timestamp: Date.now()
      })
    }
  }, [currentPath, isCached, cachePage])

  return {
    // 状态
    keepAliveState: getCurrentState(),
    cachedPages: isCached() ? [currentPath] : [],
    activePages: isActive() ? [currentPath] : [],
    config: {
      include: [],
      exclude: ['/login', '/error'],
      scrollRestoration: true,
      autoCleanup: true,
      maxCache: testData.maxCache || 10
    },
    
    // 判断方法
    isCached,
    isActive,
    
    // 操作方法
    cachePage,
    removePage,
    clearCache,
    activatePage: activatePageHandler,
    updateConfig: updateConfigHandler,
    setMaxCache: setMaxCacheHandler,
    
    // 工具方法
    getCacheStats,
    preloadPage,
    
    // 当前路径信息
    currentPath
  }
}

export default useKeepAlive

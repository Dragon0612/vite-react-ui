import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  addCachedPage,
  removeCachedPage,
  clearAllCache,
  activatePage,
  updateConfig,
  setMaxCache,
  selectKeepAliveState,
  selectCachedPages,
  selectActivePages,
  selectKeepAliveConfig
} from '@/store/slices/keepAliveSlice'

/**
 * KeepAlive 自定义 Hook
 * @returns {Object} keepAlive 相关方法和状态
 */
export const useKeepAlive = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const currentPath = location.pathname
  
  // 获取状态
  const keepAliveState = useSelector(selectKeepAliveState)
  const cachedPages = useSelector(selectCachedPages)
  const activePages = useSelector(selectActivePages)
  const config = useSelector(selectKeepAliveConfig)

  // 判断当前页面是否被缓存
  const isCached = useCallback((path = currentPath) => {
    return cachedPages.includes(path)
  }, [cachedPages, currentPath])

  // 判断当前页面是否活跃
  const isActive = useCallback((path = currentPath) => {
    return activePages.includes(path)
  }, [activePages, currentPath])

  // 添加页面到缓存
  const cachePage = useCallback((path, metadata = {}) => {
    dispatch(addCachedPage({ path, metadata }))
  }, [dispatch])

  // 从缓存中移除页面
  const removePage = useCallback((path) => {
    dispatch(removeCachedPage(path))
  }, [dispatch])

  // 清空所有缓存
  const clearCache = useCallback(() => {
    dispatch(clearAllCache())
  }, [dispatch])

  // 激活页面
  const activatePageHandler = useCallback((path) => {
    dispatch(activatePage(path))
  }, [dispatch])

  // 更新配置
  const updateConfigHandler = useCallback((newConfig) => {
    dispatch(updateConfig(newConfig))
  }, [dispatch])

  // 设置最大缓存数量
  const setMaxCacheHandler = useCallback((maxCache) => {
    dispatch(setMaxCache(maxCache))
  }, [dispatch])

  // 获取缓存统计信息
  const getCacheStats = useCallback(() => {
    return {
      totalCached: cachedPages.length,
      activePages: activePages.length,
      maxCache: config.maxCache,
      cachedPaths: [...cachedPages],
      activePaths: [...activePages],
      currentPath,
      isCurrentCached: isCached(),
      isCurrentActive: isActive()
    }
  }, [cachedPages, activePages, config.maxCache, currentPath, isCached, isActive])

  // 预加载页面
  const preloadPage = useCallback((path) => {
    if (!isCached(path)) {
      // 这里可以实现预加载逻辑
      // 比如预加载组件或数据
      console.log(`预加载页面: ${path}`)
    }
  }, [isCached])

  // 自动激活当前页面
  useEffect(() => {
    if (isCached()) {
      activatePageHandler(currentPath)
    }
  }, [currentPath, isCached, activatePageHandler])

  // 自动缓存当前页面（根据配置）
  useEffect(() => {
    const shouldCache = config.include.length === 0 
      ? !config.exclude.includes(currentPath)
      : config.include.includes(currentPath)

    if (shouldCache && !isCached()) {
      cachePage(currentPath, {
        title: document.title,
        timestamp: Date.now()
      })
    }
  }, [currentPath, config, isCached, cachePage])

  return {
    // 状态
    keepAliveState,
    cachedPages,
    activePages,
    config,
    
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

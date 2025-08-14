import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * KeepAlive 组件 - 实现页面缓存功能
 */
const KeepAlive = ({ 
  children, 
  include = [], 
  exclude = [], 
  maxCache = 10,
  scrollRestoration = true 
}) => {
  const location = useLocation()
  const currentPath = location.pathname
  const [cachedComponents, setCachedComponents] = useState(new Map())
  const [activePages, setActivePages] = useState([])
  const scrollPositions = useRef(new Map())
  const componentRefs = useRef(new Map())
  const isInitialized = useRef(false)
  
  // 判断当前路径是否需要缓存
  const shouldCache = useMemo(() => {
    if (include.length === 0) {
      return !exclude.includes(currentPath)
    }
    return include.includes(currentPath) && !exclude.includes(currentPath)
  }, [currentPath, include, exclude])

  // 保存滚动位置
  const saveScrollPosition = useCallback((path) => {
    if (scrollRestoration) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      scrollPositions.current.set(path, scrollTop)
    }
  }, [scrollRestoration])

  // 恢复滚动位置
  const restoreScrollPosition = useCallback((path) => {
    if (scrollRestoration) {
      const scrollTop = scrollPositions.current.get(path)
      if (scrollTop !== undefined) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollTop)
        })
      }
    }
  }, [scrollRestoration])

  // 清理过期缓存
  const cleanupExpiredCache = useCallback(() => {
    if (cachedComponents.size > maxCache) {
      const entries = Array.from(cachedComponents.entries())
      const toRemove = entries.slice(0, entries.length - maxCache)
      
      toRemove.forEach(([path]) => {
        cachedComponents.delete(path)
        scrollPositions.current.delete(path)
        componentRefs.current.delete(path)
      })
      
      setCachedComponents(new Map(cachedComponents))
    }
  }, [cachedComponents, maxCache])

  // 初始化缓存 - 关键修复：在组件挂载时立即缓存
  useEffect(() => {
    if (!isInitialized.current && shouldCache) {
      // 立即缓存当前页面
      const componentToCache = React.cloneElement(children, {
        key: currentPath,
        'data-keepalive-path': currentPath
      })
      
      setCachedComponents(new Map([[currentPath, componentToCache]]))
      setActivePages([currentPath])
      
      console.log(`KeepAlive: 初始化时立即缓存页面 ${currentPath}`)
      isInitialized.current = true
    }
  }, [shouldCache, currentPath, children]) // 添加必要的依赖，确保缓存逻辑正确执行

  // 处理路由变化
  useEffect(() => {
    if (!shouldCache) return

    // 保存当前页面的滚动位置
    saveScrollPosition(currentPath)
    
    // 添加到活跃页面列表
    if (!activePages.includes(currentPath)) {
      setActivePages(prev => [...prev, currentPath])
    }
    
    // 缓存组件
    if (!cachedComponents.has(currentPath)) {
      const componentToCache = React.cloneElement(children, {
        key: currentPath,
        'data-keepalive-path': currentPath
      })
      
      setCachedComponents(prev => {
        const newMap = new Map(prev)
        newMap.set(currentPath, componentToCache)
        return newMap
      })
      
      console.log(`KeepAlive: 首次缓存页面 ${currentPath}`)
    } else {
      console.log(`KeepAlive: 使用缓存页面 ${currentPath}`)
    }
    
    // 恢复滚动位置
    setTimeout(() => restoreScrollPosition(currentPath), 100)
    
    // 清理过期缓存
    cleanupExpiredCache()
  }, [currentPath, shouldCache, children, saveScrollPosition, restoreScrollPosition, cleanupExpiredCache])

  // 清理缓存的方法
  const clearCache = useCallback((path) => {
    if (path) {
      setCachedComponents(prev => {
        const newMap = new Map(prev)
        newMap.delete(path)
        return newMap
      })
      scrollPositions.current.delete(path)
      componentRefs.current.delete(path)
      setActivePages(prev => prev.filter(p => p !== path))
      console.log(`KeepAlive: 清理页面缓存 ${path}`)
    } else {
      setCachedComponents(new Map())
      scrollPositions.current.clear()
      componentRefs.current.clear()
      setActivePages([])
      isInitialized.current = false
      console.log('KeepAlive: 清理所有缓存')
    }
  }, [])

  // 获取缓存统计信息
  const getCacheInfo = useCallback(() => {
    return {
      totalCached: cachedComponents.size,
      activePages: activePages.length,
      maxCache,
      cachedPaths: Array.from(cachedComponents.keys()),
      isInitialized: isInitialized.current
    }
  }, [cachedComponents.size, activePages.length, maxCache])

  // 暴露方法给父组件
  useEffect(() => {
    if (window) {
      window.__keepAlive = {
        clearCache,
        getCacheInfo,
        cachedComponents: cachedComponents,
        activePages,
        isInitialized: isInitialized.current
      }
    }
  }, [cachedComponents, activePages, clearCache, getCacheInfo])

  // 调试信息
  useEffect(() => {
    console.log('KeepAlive Debug:', {
      currentPath,
      include,
      exclude,
      shouldCache,
      cachedComponents: Array.from(cachedComponents.keys()),
      activePages,
      isInitialized: isInitialized.current
    })
  }, [currentPath, include, exclude, shouldCache, cachedComponents, activePages])

  // 渲染逻辑
  if (shouldCache && cachedComponents.has(currentPath)) {
    console.log('KeepAlive: 渲染缓存的组件', currentPath)
    return (
      <div className="keep-alive-container">
        {Array.from(cachedComponents.entries()).map(([path, component]) => (
          <div
            key={path}
            className={`keep-alive-page ${path === currentPath ? 'active' : 'hidden'}`}
            style={{
              display: path === currentPath ? 'block' : 'none',
              position: 'relative',
              width: '100%',
              height: '100%'
            }}
            ref={(el) => {
              if (el) {
                componentRefs.current.set(path, el)
              }
            }}
          >
            {component}
          </div>
        ))}
      </div>
    )
  }

  // 不需要缓存或首次访问，直接渲染
  console.log('KeepAlive: 直接渲染组件', currentPath, 'shouldCache:', shouldCache)
  return (
    <div
      className="keep-alive-page active"
      ref={(el) => {
        if (el) {
          componentRefs.current.set(currentPath, el)
        }
      }}
    >
      {children}
    </div>
  )
}

export default KeepAlive

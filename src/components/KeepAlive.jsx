import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * KeepAlive 组件 - 实现页面缓存功能
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 * @param {Array} props.include - 需要缓存的路径数组
 * @param {Array} props.exclude - 不需要缓存的路径数组
 * @param {number} props.maxCache - 最大缓存数量，默认10
 * @param {boolean} props.scrollRestoration - 是否恢复滚动位置，默认true
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
  
  // 判断当前路径是否需要缓存
  const shouldCache = useMemo(() => {
    // 如果 include 为空，则缓存所有页面（除了 exclude 中的）
    if (include.length === 0) {
      return !exclude.includes(currentPath)
    }
    // 如果 include 不为空，则只缓存 include 中的页面
    return include.includes(currentPath) && !exclude.includes(currentPath)
  }, [currentPath, include, exclude])

  // 调试信息
  console.log('KeepAlive Debug:', {
    currentPath,
    include,
    exclude,
    shouldCache,
    cachedComponents: Array.from(cachedComponents.keys())
  })

  // 保存滚动位置
  const saveScrollPosition = (path) => {
    if (scrollRestoration) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      scrollPositions.current.set(path, scrollTop)
    }
  }

  // 恢复滚动位置
  const restoreScrollPosition = (path) => {
    if (scrollRestoration) {
      const scrollTop = scrollPositions.current.get(path)
      if (scrollTop !== undefined) {
        window.scrollTo(0, scrollTop)
      }
    }
  }

  // 清理过期缓存
  const cleanupExpiredCache = () => {
    if (cachedComponents.size > maxCache) {
      const entries = Array.from(cachedComponents.entries())
      const toRemove = entries.slice(0, entries.length - maxCache)
      
      toRemove.forEach(([path]) => {
        cachedComponents.delete(path)
        scrollPositions.current.delete(path)
      })
      
      setCachedComponents(new Map(cachedComponents))
    }
  }

  // 处理路由变化
  useEffect(() => {
    if (shouldCache) {
      // 保存当前页面的滚动位置
      saveScrollPosition(currentPath)
      
      // 添加到活跃页面列表
      if (!activePages.includes(currentPath)) {
        setActivePages(prev => [...prev, currentPath])
      }
      
      // 缓存组件
      if (!cachedComponents.has(currentPath)) {
        setCachedComponents(prev => {
          const newMap = new Map(prev)
          newMap.set(currentPath, children)
          return newMap
        })
      }
      
      // 恢复滚动位置
      setTimeout(() => restoreScrollPosition(currentPath), 0)
    }
    
    // 清理过期缓存
    cleanupExpiredCache()
  }, [currentPath, shouldCache, children])

  // 清理缓存的方法
  const clearCache = (path) => {
    if (path) {
      // 清理指定路径的缓存
      setCachedComponents(prev => {
        const newMap = new Map(prev)
        newMap.delete(path)
        return newMap
      })
      scrollPositions.current.delete(path)
      setActivePages(prev => prev.filter(p => p !== path))
    } else {
      // 清理所有缓存
      setCachedComponents(new Map())
      scrollPositions.current.clear()
      setActivePages([])
    }
  }

  // 获取缓存统计信息
  const getCacheInfo = () => {
    return {
      totalCached: cachedComponents.size,
      activePages: activePages.length,
      maxCache,
      cachedPaths: Array.from(cachedComponents.keys())
    }
  }

  // 暴露方法给父组件
  useEffect(() => {
    if (window) {
      window.__keepAlive = {
        clearCache,
        getCacheInfo,
        cachedComponents: cachedComponents,
        activePages
      }
    }
  }, [cachedComponents, activePages])

  // 渲染逻辑
  if (shouldCache && cachedComponents.has(currentPath)) {
    // 渲染缓存的组件
    console.log('KeepAlive: 渲染缓存的组件', currentPath)
    return (
      <div className="keep-alive-container">
        {Array.from(cachedComponents.entries()).map(([path, component]) => (
          <div
            key={path}
            className={`keep-alive-page ${path === currentPath ? 'active' : 'hidden'}`}
            style={{
              display: path === currentPath ? 'block' : 'none'
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
  return children
}

export default KeepAlive

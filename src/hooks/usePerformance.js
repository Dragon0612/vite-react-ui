import { useEffect, useState } from 'react'

/**
 * 性能监控Hook
 * 用于监控首屏加载性能指标
 */
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
    domLoad: 0, // DOM加载时间
    windowLoad: 0 // 窗口加载时间
  })

  useEffect(() => {
    // 监控DOM加载时间
    const domLoadTime = performance.now()
    
    // 监控窗口加载时间
    const windowLoadHandler = () => {
      const windowLoadTime = performance.now()
      setMetrics(prev => ({
        ...prev,
        windowLoad: windowLoadTime - domLoadTime
      }))
    }

    // 监控TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    if (navigationEntry) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart
      }))
    }

    // 监控FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: fcpEntry.startTime
        }))
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // 监控LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      setMetrics(prev => ({
        ...prev,
        lcp: lastEntry.startTime
      }))
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // 监控FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fidEntry = entries[0]
      setMetrics(prev => ({
        ...prev,
        fid: fidEntry.processingStart - fidEntry.startTime
      }))
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // 监控CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      setMetrics(prev => ({
        ...prev,
        cls: clsValue
      }))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // 监听窗口加载事件
    window.addEventListener('load', windowLoadHandler)

    // 清理函数
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      window.removeEventListener('load', windowLoadHandler)
    }
  }, [])

  // 获取性能报告
  const getPerformanceReport = () => {
    const report = {
      ...metrics,
      // 性能评分
      score: calculatePerformanceScore(metrics),
      // 建议
      suggestions: getPerformanceSuggestions(metrics)
    }
    
    console.log('🚀 性能监控报告:', report)
    return report
  }

  // 计算性能评分
  const calculatePerformanceScore = (metrics) => {
    let score = 100
    
    // FCP评分 (0-2.5s为优秀)
    if (metrics.fcp > 2500) score -= 20
    else if (metrics.fcp > 1800) score -= 10
    
    // LCP评分 (0-2.5s为优秀)
    if (metrics.lcp > 2500) score -= 20
    else if (metrics.lcp > 1800) score -= 10
    
    // FID评分 (0-100ms为优秀)
    if (metrics.fid > 100) score -= 15
    else if (metrics.fid > 50) score -= 5
    
    // CLS评分 (0-0.1为优秀)
    if (metrics.cls > 0.1) score -= 15
    else if (metrics.cls > 0.05) score -= 5
    
    return Math.max(0, score)
  }

  // 获取性能优化建议
  const getPerformanceSuggestions = (metrics) => {
    const suggestions = []
    
    if (metrics.fcp > 1800) {
      suggestions.push('优化首屏内容渲染，减少关键资源加载时间')
    }
    
    if (metrics.lcp > 1800) {
      suggestions.push('优化最大内容元素加载，考虑使用图片懒加载')
    }
    
    if (metrics.fid > 50) {
      suggestions.push('优化交互响应时间，减少主线程阻塞')
    }
    
    if (metrics.cls > 0.05) {
      suggestions.push('减少布局偏移，为图片和广告预留空间')
    }
    
    if (metrics.ttfb > 600) {
      suggestions.push('优化服务器响应时间，考虑使用CDN')
    }
    
    return suggestions
  }

  return {
    metrics,
    getPerformanceReport
  }
}

import { useEffect, useState } from 'react'

/**
 * 性能监控组件
 * 用于实时监控首屏加载性能
 */
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    domLoad: 0,
    windowLoad: 0,
    totalTime: 0
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 延迟显示，避免影响首屏渲染
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const paint = performance.getEntriesByType('paint')
      
      if (navigation) {
        const newMetrics = {
          ttfb: navigation.responseStart - navigation.requestStart,
          domLoad: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          windowLoad: navigation.loadEventEnd - navigation.fetchStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart
        }

        // 获取FCP
        const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          newMetrics.fcp = fcpEntry.startTime
        }

        setMetrics(prev => ({ ...prev, ...newMetrics }))
      }
    }

    // 监听LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // 监听FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fidEntry = entries[0]
      setMetrics(prev => ({ 
        ...prev, 
        fid: fidEntry.processingStart - fidEntry.startTime 
      }))
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // 监听CLS
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // 页面加载完成后收集指标
    if (document.readyState === 'complete') {
      collectMetrics()
    } else {
      window.addEventListener('load', collectMetrics)
    }

    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      window.removeEventListener('load', collectMetrics)
    }
  }, [])

  // 计算性能评分
  const calculateScore = () => {
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

  const score = calculateScore()
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreText = (score) => {
    if (score >= 90) return '优秀'
    if (score >= 70) return '良好'
    return '需要改进'
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">首屏加载性能</h3>
        <div className={`text-lg font-bold ${getScoreColor(score)}`}>
          {score}分
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        评级: <span className={getScoreColor(score)}>{getScoreText(score)}</span>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>首次内容绘制 (FCP):</span>
          <span className={metrics.fcp > 1800 ? 'text-red-500' : 'text-green-500'}>
            {Math.round(metrics.fcp)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>最大内容绘制 (LCP):</span>
          <span className={metrics.lcp > 2500 ? 'text-red-500' : 'text-green-500'}>
            {Math.round(metrics.lcp)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>首次输入延迟 (FID):</span>
          <span className={metrics.fid > 100 ? 'text-red-500' : 'text-green-500'}>
            {Math.round(metrics.fid)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>累积布局偏移 (CLS):</span>
          <span className={metrics.cls > 0.1 ? 'text-red-500' : 'text-green-500'}>
            {metrics.cls.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>总加载时间:</span>
          <span className={metrics.totalTime > 3000 ? 'text-red-500' : 'text-green-500'}>
            {Math.round(metrics.totalTime)}ms
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <button
          onClick={() => {
            console.log('🚀 性能监控报告:', {
              ...metrics,
              score,
              rating: getScoreText(score)
            })
          }}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          查看详细报告
        </button>
      </div>
    </div>
  )
}

export default PerformanceMonitor

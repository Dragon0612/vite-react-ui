/**
 * 全局性能监控服务
 * 在应用启动时自动收集首屏性能数据
 */
class GlobalPerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      domLoad: 0,
      windowLoad: 0,
      totalTime: 0
    }
    this.isCollected = false
    this.observers = []
    this.startTime = performance.now()
    
    this.init()
  }

  init() {
    // 等待DOM完全加载后再开始监控
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.startMonitoring()
      })
    } else {
      this.startMonitoring()
    }
  }

  startMonitoring() {
    console.log('🚀 启动全局性能监控...')
    
    // 收集基础导航指标
    this.collectNavigationMetrics()
    
    // 监听绘制指标
    this.observePaintMetrics()
    
    // 监听LCP
    this.observeLCP()
    
    // 监听FID
    this.observeFID()
    
    // 监听CLS
    this.observeCLS()
    
    // 页面加载完成后收集完整数据
    if (document.readyState === 'complete') {
      this.finalizeMetrics()
    } else {
      window.addEventListener('load', () => {
        this.finalizeMetrics()
      })
    }
  }

  collectNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart
      this.metrics.domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart
      this.metrics.windowLoad = navigation.loadEventEnd - navigation.fetchStart
      this.metrics.totalTime = navigation.loadEventEnd - navigation.fetchStart
      
      console.log('📊 导航性能指标已收集:', {
        ttfb: Math.round(this.metrics.ttfb),
        domLoad: Math.round(this.metrics.domLoad),
        totalTime: Math.round(this.metrics.totalTime)
      })
    }
  }

  observePaintMetrics() {
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
          console.log('🎨 FCP指标已收集:', Math.round(this.metrics.fcp), 'ms')
        }
      })
    })
    paintObserver.observe({ entryTypes: ['paint'] })
    this.observers.push(paintObserver)
  }

  observeLCP() {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.lcp = lastEntry.startTime
      console.log('🖼️ LCP指标已更新:', Math.round(this.metrics.lcp), 'ms')
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.push(lcpObserver)
  }

  observeFID() {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fidEntry = entries[0]
      if (fidEntry) {
        this.metrics.fid = fidEntry.processingStart - fidEntry.startTime
        console.log('⚡ FID指标已收集:', Math.round(this.metrics.fid), 'ms')
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
    this.observers.push(fidObserver)
  }

  observeCLS() {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.metrics.cls = clsValue
      console.log('📐 CLS指标已更新:', this.metrics.cls.toFixed(3))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(clsObserver)
  }

  finalizeMetrics() {
    setTimeout(() => {
      this.isCollected = true
      console.log('✅ 首屏性能数据收集完成:', {
        ...this.metrics,
        fcp: Math.round(this.metrics.fcp),
        lcp: Math.round(this.metrics.lcp),
        fid: Math.round(this.metrics.fid),
        cls: Number(this.metrics.cls.toFixed(3)),
        ttfb: Math.round(this.metrics.ttfb),
        domLoad: Math.round(this.metrics.domLoad),
        totalTime: Math.round(this.metrics.totalTime)
      })
      
      // 触发全局事件，通知其他组件数据已准备好
      window.dispatchEvent(new CustomEvent('performance-metrics-ready', {
        detail: this.getMetrics()
      }))
    }, 2000) // 等待2秒确保所有指标收集完成
  }

  getMetrics() {
    // 确保所有指标都有默认值
    const safeMetrics = {
      fcp: this.metrics.fcp || 0,
      lcp: this.metrics.lcp || 0,
      fid: this.metrics.fid || 0,
      cls: this.metrics.cls || 0,
      ttfb: this.metrics.ttfb || 0,
      domLoad: this.metrics.domLoad || 0,
      windowLoad: this.metrics.windowLoad || 0,
      totalTime: this.metrics.totalTime || 0,
      // 实时数据
      currentTime: this.metrics.currentTime || 0,
      memoryUsage: this.metrics.memoryUsage || null
    }

    return {
      ...safeMetrics,
      score: this.calculateScore(),
      level: this.getScoreLevel(),
      suggestions: this.getSuggestions(),
      isCollected: this.isCollected,
      collectedAt: new Date().toISOString()
    }
  }

  calculateScore() {
    let score = 100
    
    if (this.metrics.fcp > 2500) score -= 20
    else if (this.metrics.fcp > 1800) score -= 10
    
    if (this.metrics.lcp > 2500) score -= 20
    else if (this.metrics.lcp > 1800) score -= 10
    
    if (this.metrics.fid > 100) score -= 15
    else if (this.metrics.fid > 50) score -= 5
    
    if (this.metrics.cls > 0.1) score -= 15
    else if (this.metrics.cls > 0.05) score -= 5
    
    return Math.max(0, score)
  }

  getScoreLevel() {
    const score = this.calculateScore()
    if (score >= 90) return { text: '优秀', color: 'success' }
    if (score >= 70) return { text: '良好', color: 'warning' }
    return { text: '需要改进', color: 'error' }
  }

  getSuggestions() {
    const suggestions = []
    
    if (this.metrics.fcp > 1800) {
      suggestions.push({
        type: 'warning',
        message: '首次内容绘制(FCP)较慢，建议优化关键资源加载'
      })
    }
    
    if (this.metrics.lcp > 2500) {
      suggestions.push({
        type: 'error',
        message: '最大内容绘制(LCP)过慢，建议优化图片加载或使用懒加载'
      })
    }
    
    if (this.metrics.fid > 100) {
      suggestions.push({
        type: 'warning',
        message: '首次输入延迟(FID)较高，建议减少主线程阻塞'
      })
    }
    
    if (this.metrics.cls > 0.1) {
      suggestions.push({
        type: 'error',
        message: '累积布局偏移(CLS)过高，建议为动态内容预留空间'
      })
    }
    
    if (this.metrics.ttfb > 600) {
      suggestions.push({
        type: 'info',
        message: '服务器响应时间较慢，建议优化后端或使用CDN'
      })
    }

    return suggestions
  }

  // 清理观察者
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  // 重置并重新开始监控（用于SPA路由切换）
  reset() {
    this.cleanup()
    this.metrics = {
      fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb: 0,
      domLoad: 0, windowLoad: 0, totalTime: 0
    }
    this.isCollected = false
    this.startTime = performance.now()
    this.startMonitoring()
  }

  // 实时更新性能数据（用于实时监控）
  updateRealTimeMetrics() {
    // 更新导航指标
    this.collectNavigationMetrics()
    
    // 更新当前时间戳
    const currentPerformanceTime = performance.now()
    this.metrics.currentTime = currentPerformanceTime - this.startTime
    
    // 计算内存使用情况（如果支持）
    if (performance.memory) {
      this.metrics.memoryUsage = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) // MB
      }
    }
    
    console.log('🔄 实时指标更新:', {
      运行时间: Math.round(this.metrics.currentTime / 1000) + '秒',
      内存使用: this.metrics.memoryUsage?.used + 'MB'
    })
  }
}

// 创建全局实例
export const globalPerformanceMonitor = new GlobalPerformanceMonitor()

// 导出便捷方法
export const getGlobalPerformanceMetrics = () => {
  return globalPerformanceMonitor.getMetrics()
}

export const isPerformanceDataReady = () => {
  return globalPerformanceMonitor.isCollected
}

export const resetPerformanceMonitoring = () => {
  globalPerformanceMonitor.reset()
}

export const updateRealTimePerformanceMetrics = () => {
  globalPerformanceMonitor.updateRealTimeMetrics()
  return globalPerformanceMonitor.getMetrics()
}

export default globalPerformanceMonitor

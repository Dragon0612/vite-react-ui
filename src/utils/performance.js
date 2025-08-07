// 性能监控工具
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      routeSwitches: 0,
      totalSwitchTime: 0,
      averageSwitchTime: 0,
      componentRenderTime: {},
      propsInjectionTime: {}
    }
  }

  // 开始监控路由切换
  startRouteSwitch() {
    this.currentSwitchStart = performance.now()
  }

  // 结束监控路由切换
  endRouteSwitch(routePath) {
    if (this.currentSwitchStart) {
      const switchTime = performance.now() - this.currentSwitchStart
      this.metrics.routeSwitches++
      this.metrics.totalSwitchTime += switchTime
      this.metrics.averageSwitchTime = this.metrics.totalSwitchTime / this.metrics.routeSwitches
      
      console.log(`🚀 路由切换性能: ${routePath} - ${switchTime.toFixed(2)}ms`)
      console.log(`📊 平均切换时间: ${this.metrics.averageSwitchTime.toFixed(2)}ms`)
      
      this.currentSwitchStart = null
    }
  }

  // 监控组件渲染时间
  monitorComponentRender(componentName, renderFunction) {
    const startTime = performance.now()
    const result = renderFunction()
    const renderTime = performance.now() - startTime
    
    if (!this.metrics.componentRenderTime[componentName]) {
      this.metrics.componentRenderTime[componentName] = []
    }
    this.metrics.componentRenderTime[componentName].push(renderTime)
    
    console.log(`⚡ 组件渲染: ${componentName} - ${renderTime.toFixed(2)}ms`)
    
    return result
  }

  // 监控参数注入时间
  monitorPropsInjection(componentName, injectionFunction) {
    const startTime = performance.now()
    const result = injectionFunction()
    const injectionTime = performance.now() - startTime
    
    if (!this.metrics.propsInjectionTime[componentName]) {
      this.metrics.propsInjectionTime[componentName] = []
    }
    this.metrics.propsInjectionTime[componentName].push(injectionTime)
    
    console.log(`🔧 参数注入: ${componentName} - ${injectionTime.toFixed(2)}ms`)
    
    return result
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      ...this.metrics,
      componentRenderAverages: Object.keys(this.metrics.componentRenderTime).reduce((acc, component) => {
        const times = this.metrics.componentRenderTime[component]
        acc[component] = times.reduce((sum, time) => sum + time, 0) / times.length
        return acc
      }, {}),
      propsInjectionAverages: Object.keys(this.metrics.propsInjectionTime).reduce((acc, component) => {
        const times = this.metrics.propsInjectionTime[component]
        acc[component] = times.reduce((sum, time) => sum + time, 0) / times.length
        return acc
      }, {})
    }
  }

  // 打印性能报告
  printPerformanceReport() {
    const report = this.getPerformanceReport()
    console.log('📈 性能监控报告:')
    console.log(`总路由切换次数: ${report.routeSwitches}`)
    console.log(`平均切换时间: ${report.averageSwitchTime.toFixed(2)}ms`)
    console.log('组件渲染平均时间:', report.componentRenderAverages)
    console.log('参数注入平均时间:', report.propsInjectionAverages)
  }

  // 重置监控数据
  reset() {
    this.metrics = {
      routeSwitches: 0,
      totalSwitchTime: 0,
      averageSwitchTime: 0,
      componentRenderTime: {},
      propsInjectionTime: {}
    }
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 性能监控Hook
export const usePerformanceMonitor = () => {
  return {
    startRouteSwitch: () => performanceMonitor.startRouteSwitch(),
    endRouteSwitch: (routePath) => performanceMonitor.endRouteSwitch(routePath),
    monitorComponentRender: (componentName, renderFunction) => 
      performanceMonitor.monitorComponentRender(componentName, renderFunction),
    monitorPropsInjection: (componentName, injectionFunction) => 
      performanceMonitor.monitorPropsInjection(componentName, injectionFunction),
    getPerformanceReport: () => performanceMonitor.getPerformanceReport(),
    printPerformanceReport: () => performanceMonitor.printPerformanceReport(),
    reset: () => performanceMonitor.reset()
  }
}

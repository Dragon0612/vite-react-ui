// 性能监控工具使用示例
import { usePerformanceMonitor } from './performance'

// 基本使用示例
export const BasicUsage = () => {
  const { 
    startRouteSwitch, 
    endRouteSwitch, 
    monitorComponentRender,
    monitorPropsInjection,
    getPerformanceReport,
    printPerformanceReport 
  } = usePerformanceMonitor()

  // 监控路由切换
  const monitorRoute = () => {
    startRouteSwitch()
    setTimeout(() => {
      endRouteSwitch('/test-route')
    }, 100)
  }

  // 监控组件渲染
  const monitorRender = () => {
    return monitorComponentRender('TestComponent', () => {
      // 要监控的代码
      let sum = 0
      for (let i = 0; i < 100000; i++) {
        sum += i
      }
      return sum // 返回计算结果而不是JSX
    })
  }

  // 监控参数注入
  const monitorProps = () => {
    return monitorPropsInjection('TestComponent', () => {
      return {
        title: '测试标题',
        userInfo: { name: '测试用户' }
      }
    })
  }

  // 获取性能报告
  const getReport = () => {
    const report = getPerformanceReport()
    console.log('性能报告:', report)
  }

  return {
    monitorRoute,
    monitorRender,
    monitorProps,
    getReport,
    printPerformanceReport
  }
}

// 在组件中使用
export const usePerformanceInComponent = () => {
  const monitor = usePerformanceMonitor()
  
  const testPerformance = () => {
    // 监控组件渲染
    monitor.monitorComponentRender('MyComponent', () => {
      return '测试组件结果' // 返回字符串而不是JSX
    })
    
    // 获取报告
    const report = monitor.getPerformanceReport()
    console.log('测试完成:', report)
  }
  
  return { testPerformance }
}

// 一行代码监控
export const quickMonitor = (fn, name = 'Function') => {
  const { monitorComponentRender } = usePerformanceMonitor()
  return monitorComponentRender(name, fn)
}

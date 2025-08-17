import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

/**
 * 首屏加载性能测试脚本
 */
const testFirstScreenPerformance = async () => {
  console.log('🚀 开始首屏加载性能测试...')
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // 设置视口大小
    await page.setViewport({ width: 1920, height: 1080 })
    
    // 启用性能监控
    await page.setCacheEnabled(false)
    
    // 监听性能指标
    const performanceMetrics = {}
    
    // 监听页面加载事件
    page.on('load', async () => {
      console.log('📄 页面加载完成')
    })
    
    // 监听DOM内容加载事件
    page.on('domcontentloaded', async () => {
      console.log('🏗️  DOM内容加载完成')
    })
    
    // 获取性能指标
    const getPerformanceMetrics = async () => {
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        
        return {
          // 页面加载时间
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          // DOM内容加载时间
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          // 首次内容绘制
          fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          // 首次绘制
          fp: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          // 最大内容绘制
          lcp: 0, // 需要额外计算
          // 资源加载时间
          resourceLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          // 总加载时间
          totalTime: navigation.loadEventEnd - navigation.fetchStart
        }
      })
      
      return metrics
    }
    
    // 开始测试
    console.log('🌐 开始访问页面...')
    const startTime = Date.now()
    
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle0',
      timeout: 30000
    })
    
    // 等待页面完全加载
    await page.waitForTimeout(2000)
    
    // 获取性能指标
    const metrics = await getPerformanceMetrics()
    
    // 计算LCP (模拟)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime || 0)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
        
        // 5秒后返回当前值
        setTimeout(() => resolve(0), 5000)
      })
    })
    
    metrics.lcp = lcp
    
    const endTime = Date.now()
    const testDuration = endTime - startTime
    
    // 生成测试报告
    const report = {
      timestamp: new Date().toISOString(),
      testDuration: `${testDuration}ms`,
      metrics: {
        ...metrics,
        // 转换为毫秒
        fcp: Math.round(metrics.fcp),
        fp: Math.round(metrics.fp),
        lcp: Math.round(metrics.lcp),
        loadTime: Math.round(metrics.loadTime),
        domContentLoaded: Math.round(metrics.domContentLoaded),
        resourceLoadTime: Math.round(metrics.resourceLoadTime),
        totalTime: Math.round(metrics.totalTime)
      },
      performance: {
        excellent: metrics.fcp < 1000 && metrics.lcp < 2500,
        good: metrics.fcp < 1800 && metrics.lcp < 4000,
        needsImprovement: metrics.fcp >= 1800 || metrics.lcp >= 4000
      }
    }
    
    // 输出测试结果
    console.log('\n📊 首屏加载性能测试结果')
    console.log('='.repeat(50))
    console.log(`测试时间: ${report.timestamp}`)
    console.log(`测试耗时: ${report.testDuration}`)
    console.log('')
    console.log('📈 性能指标:')
    console.log(`  首次绘制 (FP): ${report.metrics.fp}ms`)
    console.log(`  首次内容绘制 (FCP): ${report.metrics.fcp}ms`)
    console.log(`  最大内容绘制 (LCP): ${report.metrics.lcp}ms`)
    console.log(`  DOM内容加载: ${report.metrics.domContentLoaded}ms`)
    console.log(`  页面完全加载: ${report.metrics.loadTime}ms`)
    console.log(`  资源加载时间: ${report.metrics.resourceLoadTime}ms`)
    console.log(`  总加载时间: ${report.metrics.totalTime}ms`)
    console.log('')
    
    // 性能评级
    console.log('🎯 性能评级:')
    if (report.performance.excellent) {
      console.log('  ✅ 优秀 - 首屏加载性能极佳')
    } else if (report.performance.good) {
      console.log('  ✅ 良好 - 首屏加载性能良好')
    } else {
      console.log('  ⚠️  需要改进 - 首屏加载性能有待提升')
    }
    
    // 优化建议
    console.log('\n💡 优化建议:')
    if (report.metrics.fcp > 1800) {
      console.log('  - 优化首屏内容渲染，减少关键资源加载时间')
    }
    if (report.metrics.lcp > 4000) {
      console.log('  - 优化最大内容元素加载，考虑使用图片懒加载')
    }
    if (report.metrics.totalTime > 3000) {
      console.log('  - 优化整体加载时间，考虑代码分割和资源压缩')
    }
    
    // 保存测试报告
    const reportPath = path.join(process.cwd(), 'performance-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 测试报告已保存到: ${reportPath}`)
    
    return report
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    throw error
  } finally {
    await browser.close()
  }
}

// 执行测试
testFirstScreenPerformance()
  .then(() => {
    console.log('\n✅ 首屏加载性能测试完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 测试失败:', error)
    process.exit(1)
  })

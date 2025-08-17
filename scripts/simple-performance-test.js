import fs from 'fs'
import path from 'path'

/**
 * 简单性能测试脚本
 * 分析构建结果和性能数据
 */
const simplePerformanceTest = () => {
  console.log('🚀 开始简单性能测试...')
  
  try {
    // 检查构建结果
    const distPath = path.resolve('./dist')
    if (!fs.existsSync(distPath)) {
      console.error('❌ 请先运行 npm run build')
      return
    }
    
    // 分析文件大小
    const fileSizes = analyzeFileSizes(distPath)
    
    // 生成性能报告
    generatePerformanceReport(fileSizes)
    
    // 检查性能预算
    checkPerformanceBudget(fileSizes)
    
    // 生成优化建议
    generateOptimizationSuggestions(fileSizes)
    
  } catch (error) {
    console.error('❌ 性能测试失败:', error.message)
  }
}

// 分析文件大小
const analyzeFileSizes = (dirPath) => {
  const sizes = {
    total: 0,
    js: 0,
    css: 0,
    html: 0,
    images: 0,
    others: 0,
    files: [],
    chunks: {}
  }
  
  const analyzeDirectory = (dir) => {
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        analyzeDirectory(fullPath)
      } else {
        const size = stat.size
        const ext = path.extname(item).toLowerCase()
        
        sizes.total += size
        sizes.files.push({
          name: item,
          path: fullPath,
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        })
        
        if (ext === '.js') {
          sizes.js += size
          // 分析代码分割
          if (item.includes('vendor')) {
            sizes.chunks.vendor = size
          } else if (item.includes('antd')) {
            sizes.chunks.antd = size
          } else if (item.includes('router')) {
            sizes.chunks.router = size
          } else if (item.includes('http')) {
            sizes.chunks.http = size
          }
        } else if (ext === '.css') {
          sizes.css += size
        } else if (ext === '.html') {
          sizes.html += size
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
          sizes.images += size
        } else {
          sizes.others += size
        }
      }
    })
  }
  
  analyzeDirectory(dirPath)
  return sizes
}

// 生成性能报告
const generatePerformanceReport = (sizes) => {
  console.log('\n📊 性能报告')
  console.log('='.repeat(50))
  
  console.log(`总大小: ${(sizes.total / 1024 / 1024).toFixed(2)} MB`)
  console.log(`JavaScript: ${(sizes.js / 1024 / 1024).toFixed(2)} MB`)
  console.log(`CSS: ${(sizes.css / 1024).toFixed(2)} KB`)
  console.log(`HTML: ${(sizes.html / 1024).toFixed(2)} KB`)
  console.log(`图片: ${(sizes.images / 1024).toFixed(2)} KB`)
  console.log(`其他: ${(sizes.others / 1024).toFixed(2)} KB`)
  
  console.log('\n📁 代码分割详情:')
  Object.entries(sizes.chunks).forEach(([name, size]) => {
    console.log(`  ${name}: ${(size / 1024).toFixed(2)} KB`)
  })
  
  console.log('\n📁 文件详情:')
  sizes.files
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(file => {
      console.log(`  ${file.name}: ${file.sizeKB} KB`)
    })
}

// 检查性能预算
const checkPerformanceBudget = (sizes) => {
  console.log('\n🎯 性能预算检查')
  console.log('='.repeat(50))
  
  const budget = {
    total: 2 * 1024 * 1024, // 2MB
    js: 1.5 * 1024 * 1024,  // 1.5MB
    css: 100 * 1024,        // 100KB
    html: 10 * 1024,        // 10KB
  }
  
  const checks = [
    { name: '总大小', current: sizes.total, budget: budget.total },
    { name: 'JavaScript', current: sizes.js, budget: budget.js },
    { name: 'CSS', current: sizes.css, budget: budget.css },
    { name: 'HTML', current: sizes.html, budget: budget.html },
  ]
  
  checks.forEach(check => {
    const percentage = (check.current / check.budget * 100).toFixed(1)
    const status = check.current <= check.budget ? '✅' : '❌'
    const unit = check.name === '总大小' || check.name === 'JavaScript' ? 'MB' : 'KB'
    const current = check.name === '总大小' || check.name === 'JavaScript' 
      ? (check.current / 1024 / 1024).toFixed(2)
      : (check.current / 1024).toFixed(2)
    const budgetValue = check.name === '总大小' || check.name === 'JavaScript'
      ? (check.budget / 1024 / 1024).toFixed(2)
      : (check.budget / 1024).toFixed(2)
    
    console.log(`${status} ${check.name}: ${current} ${unit} / ${budgetValue} ${unit} (${percentage}%)`)
  })
  
  // 检查是否有超大文件
  const largeFiles = sizes.files.filter(file => file.size > 500 * 1024) // 500KB
  if (largeFiles.length > 0) {
    console.log('\n⚠️  超大文件警告:')
    largeFiles.forEach(file => {
      console.log(`  ${file.name}: ${file.sizeKB} KB`)
    })
  }
}

// 生成优化建议
const generateOptimizationSuggestions = (sizes) => {
  console.log('\n💡 优化建议')
  console.log('='.repeat(50))
  
  const suggestions = []
  
  // 检查Ant Design包大小
  if (sizes.chunks.antd && sizes.chunks.antd > 500 * 1024) {
    suggestions.push('🔧 Ant Design包过大，建议实现按需引入')
  }
  
  // 检查总大小
  if (sizes.total > 1.5 * 1024 * 1024) {
    suggestions.push('🔧 总体积较大，建议进一步优化')
  }
  
  // 检查图片大小
  if (sizes.images > 100 * 1024) {
    suggestions.push('🔧 图片资源较大，建议使用WebP格式和懒加载')
  }
  
  // 检查代码分割效果
  const chunkCount = Object.keys(sizes.chunks).length
  if (chunkCount < 3) {
    suggestions.push('🔧 代码分割不够细致，建议进一步分割')
  }
  
  if (suggestions.length === 0) {
    console.log('✅ 当前优化效果良好，无需进一步优化')
  } else {
    suggestions.forEach(suggestion => {
      console.log(suggestion)
    })
  }
  
  // 首屏加载时间估算
  const estimatedLoadTime = estimateLoadTime(sizes)
  console.log(`\n⏱️  预估首屏加载时间: ${estimatedLoadTime}ms`)
  
  if (estimatedLoadTime < 1500) {
    console.log('✅ 首屏加载时间优秀')
  } else if (estimatedLoadTime < 3000) {
    console.log('✅ 首屏加载时间良好')
  } else {
    console.log('⚠️  首屏加载时间需要优化')
  }
}

// 估算首屏加载时间
const estimateLoadTime = (sizes) => {
  // 基于文件大小和网络条件估算
  const baseTime = 200 // 基础时间
  const jsTime = (sizes.js / 1024 / 1024) * 800 // JS加载时间
  const cssTime = (sizes.css / 1024) * 2 // CSS加载时间
  const htmlTime = 100 // HTML解析时间
  
  return Math.round(baseTime + jsTime + cssTime + htmlTime)
}

// 执行测试
simplePerformanceTest()

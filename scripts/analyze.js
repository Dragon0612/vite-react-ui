import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// 构建分析脚本
const analyzeBuild = () => {
  console.log('🔍 开始构建分析...')
  
  try {
    // 执行构建
    console.log('📦 执行构建...')
    execSync('npm run build', { stdio: 'inherit' })
    
    // 分析dist目录
    const distPath = path.resolve('./dist')
    if (!fs.existsSync(distPath)) {
      console.error('❌ dist目录不存在，构建可能失败')
      return
    }
    
    console.log('\n📊 构建结果分析:')
    analyzeDirectory(distPath)
    
  } catch (error) {
    console.error('❌ 构建分析失败:', error.message)
  }
}

// 分析目录结构
const analyzeDirectory = (dirPath, prefix = '') => {
  const items = fs.readdirSync(dirPath)
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      console.log(`${prefix}📁 ${item}/`)
      analyzeDirectory(fullPath, prefix + '  ')
    } else {
      const size = (stat.size / 1024).toFixed(2)
      console.log(`${prefix}📄 ${item} (${size} KB)`)
    }
  })
}

// 执行分析
analyzeBuild()

#!/usr/bin/env node

/**
 * API架构演示启动脚本
 * 用于测试和验证新API架构的功能
 */

console.log('🚀 启动API架构演示...')

// 模拟浏览器环境
global.window = {}
global.localStorage = {
  getItem: (key) => {
    const store = {
      'token': 'test-token-123',
      'refreshToken': 'refresh-token-456'
    }
    return store[key] || null
  },
  setItem: (key, value) => {
    console.log(`📝 设置 ${key}: ${value}`)
  },
  removeItem: (key) => {
    console.log(`🗑️  删除 ${key}`)
  }
}

// 模拟console.log
const originalLog = console.log
console.log = (...args) => {
  originalLog('📊', ...args)
}

// 模拟fetch (如果需要)
global.fetch = async (url, options = {}) => {
  console.log(`🌐 模拟请求: ${url}`)
  return {
    ok: true,
    json: async () => ({ success: true, data: { message: '模拟响应' } })
  }
}

try {
  // 动态导入API模块
  const apiModule = await import('./src/services/api/index.js')
  
  console.log('✅ API模块加载成功')
  
  // 测试基本功能
  const { httpClient, userService, authService, getEnvConfig } = apiModule
  
  console.log('🔧 环境配置:', getEnvConfig())
  console.log('🌐 HTTP客户端配置:', httpClient.getConfig())
  console.log('👥 用户服务:', userService.constructor.name)
  console.log('🔐 认证服务:', authService.constructor.name)
  
  // 测试服务创建
  const customService = httpClient.createService('demo', 'https://demo-api.com')
  console.log('🆕 自定义服务创建成功:', customService.constructor.name)
  
  console.log('\n🎉 API架构演示启动完成！')
  console.log('💡 现在可以在浏览器中访问 /performance/api-demo 查看完整演示')
  
} catch (error) {
  console.error('❌ 启动失败:', error.message)
  console.log('\n🔧 故障排除建议:')
  console.log('1. 确保所有依赖已安装: npm install')
  console.log('2. 检查文件路径是否正确')
  console.log('3. 验证ES模块配置')
}

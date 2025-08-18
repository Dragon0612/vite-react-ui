/**
 * Apifox 登录接口使用示例
 * 演示如何在项目中调用 Apifox Mock 登录接口 (GET 请求)
 * 接口地址: https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login
 */

import { loginToApifox, apifoxAuthService } from '@/services/api'

/**
 * 基础登录示例
 */
export const basicLoginExample = async () => {
  try {
    // 准备登录凭据
    const credentials = {
      username: 'admin@example.com',
      password: 'admin123'
    }
    
    console.log('🚀 开始登录...')
    
    // 调用 Apifox 登录接口
    const result = await loginToApifox(credentials)
    
    if (result.success) {
      console.log('✅ 登录成功!')
      console.log('📋 用户信息:', result.data.user)
      console.log('🔑 Token:', result.data.token)
      
      return {
        success: true,
        user: result.data.user,
        token: result.data.token
      }
    } else {
      console.log('❌ 登录失败:', result.message)
      return {
        success: false,
        error: result.message
      }
    }
  } catch (error) {
    console.error('💥 登录异常:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 智能登录示例 (自动选择真实API或Mock)
 */
export const smartLoginExample = async (credentials) => {
  try {
    console.log('🤖 使用智能登录...')
    
    // 智能登录会根据环境自动选择真实API或Mock API
    const result = await apifoxAuthService.smartLogin(credentials)
    
    console.log('📊 登录结果:', result)
    return result
  } catch (error) {
    console.error('💥 智能登录异常:', error)
    throw error
  }
}

/**
 * 批量登录测试示例
 */
export const batchLoginTest = async () => {
  const testUsers = [
    { username: 'admin@example.com', password: 'admin123', role: '管理员' },
    { username: 'user@example.com', password: 'user123', role: '普通用户' },
    { username: 'test@example.com', password: 'test123', role: '测试用户' }
  ]
  
  const results = []
  
  for (const user of testUsers) {
    console.log(`🧪 测试${user.role}登录: ${user.username}`)
    
    try {
      const result = await loginToApifox({
        username: user.username,
        password: user.password
      })
      
      results.push({
        user: user.username,
        role: user.role,
        success: result.success,
        data: result.data || result.error
      })
      
      // 如果登录成功，等待一下再登出
      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await apifoxAuthService.logout()
      }
      
    } catch (error) {
      results.push({
        user: user.username,
        role: user.role,
        success: false,
        error: error.message
      })
    }
    
    // 延迟一下避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('📋 批量测试结果:', results)
  return results
}

/**
 * 登录状态管理示例
 */
export const loginStateExample = async () => {
  // 检查当前登录状态
  let authStatus = apifoxAuthService.getAuthStatus()
  console.log('📊 当前登录状态:', authStatus)
  
  if (!authStatus.isAuthenticated) {
    console.log('🔐 用户未登录，开始登录...')
    
    // 执行登录
    const loginResult = await loginToApifox({
      username: 'admin@example.com',
      password: 'admin123'
    })
    
    if (loginResult.success) {
      console.log('✅ 登录成功')
      
      // 重新检查登录状态
      authStatus = apifoxAuthService.getAuthStatus()
      console.log('📊 登录后状态:', authStatus)
    }
  }
  
  return authStatus
}

/**
 * 错误处理示例
 */
export const errorHandlingExample = async () => {
  try {
    // 使用错误的凭据进行登录
    const result = await loginToApifox({
      username: 'wrong@example.com',
      password: 'wrongpassword'
    })
    
    if (!result.success) {
      console.log('❌ 预期的登录失败:', result.message)
      
      // 处理不同类型的错误
      if (result.error?.code === 'USER_NOT_FOUND') {
        console.log('👤 用户不存在')
      } else if (result.error?.code === 'INVALID_PASSWORD') {
        console.log('🔑 密码错误')
      } else {
        console.log('❓ 其他错误:', result.error)
      }
    }
    
    return result
  } catch (error) {
    console.error('💥 网络或系统错误:', error)
    
    // 可以在这里处理网络错误、超时等
    if (error.code === 'NETWORK_ERROR') {
      console.log('🌐 网络连接失败')
    } else if (error.code === 'TIMEOUT') {
      console.log('⏰ 请求超时')
    }
    
    throw error
  }
}

/**
 * 完整使用流程示例
 */
export const completeFlowExample = async () => {
  console.log('🚀 开始完整的 Apifox 登录流程演示...')
  
  try {
    // 1. 检查接口连接
    console.log('1️⃣ 检查接口连接...')
    const connectionTest = await apifoxAuthService.testLoginEndpoint()
    console.log('🔗 连接测试结果:', connectionTest)
    
    if (!connectionTest.success) {
      throw new Error('接口连接失败')
    }
    
    // 2. 执行登录
    console.log('2️⃣ 执行登录...')
    const loginResult = await loginToApifox({
      username: 'admin@example.com',
      password: 'admin123'
    })
    
    if (!loginResult.success) {
      throw new Error(`登录失败: ${loginResult.message}`)
    }
    
    console.log('✅ 登录成功!')
    
    // 3. 验证登录状态
    console.log('3️⃣ 验证登录状态...')
    const authStatus = apifoxAuthService.getAuthStatus()
    console.log('📊 登录状态:', authStatus)
    
    // 4. 模拟使用登录状态进行其他操作
    console.log('4️⃣ 模拟业务操作...')
    if (authStatus.isAuthenticated) {
      console.log('🎯 可以执行需要登录的业务操作')
      // 这里可以调用其他需要认证的API
    }
    
    // 5. 登出
    console.log('5️⃣ 执行登出...')
    const logoutResult = await apifoxAuthService.logout()
    console.log('👋 登出结果:', logoutResult)
    
    console.log('🎉 完整流程演示完成!')
    
    return {
      connection: connectionTest,
      login: loginResult,
      auth: authStatus,
      logout: logoutResult
    }
    
  } catch (error) {
    console.error('❌ 流程执行失败:', error)
    throw error
  }
}

// 导出所有示例
export default {
  basicLoginExample,
  smartLoginExample,
  batchLoginTest,
  loginStateExample,
  errorHandlingExample,
  completeFlowExample
}

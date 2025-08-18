import { AuthService } from './AuthService'
import { apifoxMockInstance, APIFOX_PROJECT_INFO, createSmartApiCall } from '../apifox.config'

/**
 * 增强的认证服务 - 集成 Apifox Mock
 * 支持直接调用 Apifox 登录接口
 */
export class ApifoxAuthService extends AuthService {
  constructor(baseURL, options = {}) {
    super(baseURL, options)
    this.loginEndpoint = APIFOX_PROJECT_INFO.endpoints.login
  }

  /**
   * 使用 Apifox Mock 登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  async loginWithApifox(credentials) {
    try {
      console.log('🎭 使用 Apifox Mock 登录服务...')
      console.log('📡 请求地址:', `${apifoxMockInstance.defaults.baseURL}${this.loginEndpoint}`)
      console.log('📝 请求参数:', credentials)
      console.log('🔑 认证 Token:', 'shpT2Zh4YXB4oeDJ44Q47')

      const response = await apifoxMockInstance.get(this.loginEndpoint, { 
        params: credentials,
        headers: {
          'Authorization': 'Bearer shpT2Zh4YXB4oeDJ44Q47',
          'apifoxToken': 'shpT2Zh4YXB4oeDJ44Q47'
        }
      })
      
      console.log('✅ Apifox 登录成功:', response.data)
      
      // 保存 token 到本地存储
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user || {}))
      }

      return {
        success: true,
        data: response.data,
        message: '登录成功'
      }
    } catch (error) {
      console.error('❌ Apifox 登录失败:', error)
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || '登录失败'
      }
    }
  }

  /**
   * 智能登录 - 自动选择真实 API 或 Apifox Mock
   * @param {Object} credentials - 登录凭据
   * @returns {Promise<Object>} 登录结果
   */
  async smartLogin(credentials) {
    return createSmartApiCall(
      // 真实 API 登录
      () => super.login(credentials),
      // Apifox Mock 端点
      this.loginEndpoint
    )()
  }

  /**
   * 直接调用 Apifox Mock 登录接口
   * @param {Object} credentials - 登录凭据
   * @returns {Promise<Object>} 登录结果
   */
  async mockLogin(credentials) {
    const result = await this.loginWithApifox(credentials)
    
    // 触发登录状态更新事件
    if (result.success) {
      window.dispatchEvent(new CustomEvent('auth:login', { 
        detail: result.data 
      }))
    }
    
    return result
  }

  /**
   * 测试 Apifox 登录接口连接
   * @returns {Promise<Object>} 测试结果
   */
  async testLoginEndpoint() {
    try {
      console.log('🔍 测试 Apifox 登录接口连接...')
      
      // 使用测试凭据
      const testCredentials = {
        username: 'test@example.com',
        password: 'test123'
      }
      
      const result = await this.loginWithApifox(testCredentials)
      
      return {
        success: result.success,
        endpoint: `${apifoxMockInstance.defaults.baseURL}${this.loginEndpoint}`,
        message: result.success ? '连接正常' : '连接失败',
        data: result.data || result.error
      }
    } catch (error) {
      return {
        success: false,
        endpoint: `${apifoxMockInstance.defaults.baseURL}${this.loginEndpoint}`,
        message: '连接异常',
        error: error.message
      }
    }
  }

  /**
   * 获取登录接口信息
   * @returns {Object} 接口信息
   */
  getLoginEndpointInfo() {
    return {
      url: `${apifoxMockInstance.defaults.baseURL}${this.loginEndpoint}`,
      method: 'GET',
      endpoint: this.loginEndpoint,
      baseUrl: apifoxMockInstance.defaults.baseURL,
      timeout: apifoxMockInstance.defaults.timeout,
      headers: apifoxMockInstance.defaults.headers
    }
  }

  /**
   * 模拟多种登录场景测试
   * @returns {Promise<Array>} 测试结果数组
   */
  async testLoginScenarios() {
    const scenarios = [
      {
        name: '正常登录',
        credentials: { username: 'admin@example.com', password: 'admin123' }
      },
      {
        name: '错误密码',
        credentials: { username: 'admin@example.com', password: 'wrongpass' }
      },
      {
        name: '不存在的用户',
        credentials: { username: 'notexist@example.com', password: 'password' }
      },
      {
        name: '空用户名',
        credentials: { username: '', password: 'password' }
      },
      {
        name: '空密码',
        credentials: { username: 'user@example.com', password: '' }
      }
    ]

    const results = []

    for (const scenario of scenarios) {
      console.log(`🧪 测试场景: ${scenario.name}`)
      
      try {
        const startTime = Date.now()
        const result = await this.loginWithApifox(scenario.credentials)
        const endTime = Date.now()
        
        results.push({
          scenario: scenario.name,
          credentials: scenario.credentials,
          success: result.success,
          response: result.data || result.error,
          responseTime: endTime - startTime,
          timestamp: new Date().toISOString()
        })
        
        // 延迟一下避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        results.push({
          scenario: scenario.name,
          credentials: scenario.credentials,
          success: false,
          error: error.message,
          responseTime: 0,
          timestamp: new Date().toISOString()
        })
      }
    }

    console.log('📋 登录场景测试完成:', results)
    return results
  }

  /**
   * 登出 - 清除本地存储
   * @returns {Promise<Object>} 登出结果
   */
  async logout() {
    try {
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // 触发登出事件
      window.dispatchEvent(new CustomEvent('auth:logout'))
      
      console.log('✅ 登出成功')
      
      return {
        success: true,
        message: '登出成功'
      }
    } catch (error) {
      console.error('❌ 登出失败:', error)
      
      return {
        success: false,
        error: error.message,
        message: '登出失败'
      }
    }
  }

  /**
   * 获取当前登录状态
   * @returns {Object} 登录状态
   */
  getAuthStatus() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    return {
      isAuthenticated: !!token,
      token: token,
      user: user ? JSON.parse(user) : null,
      loginTime: localStorage.getItem('loginTime')
    }
  }
}

// 创建增强的认证服务实例
export const apifoxAuthService = new ApifoxAuthService()

// 导出便捷的登录方法
export const loginToApifox = async (credentials) => {
  return await apifoxAuthService.loginWithApifox(credentials)
}

// 导出测试方法
export const testApifoxLogin = async () => {
  console.log('🚀 开始 Apifox 登录功能测试...')
  
  const service = new ApifoxAuthService()
  
  // 1. 获取接口信息
  const endpointInfo = service.getLoginEndpointInfo()
  console.log('📋 登录接口信息:', endpointInfo)
  
  // 2. 测试连接
  const connectionTest = await service.testLoginEndpoint()
  console.log('🔗 连接测试结果:', connectionTest)
  
  // 3. 测试多种登录场景
  const scenarioTests = await service.testLoginScenarios()
  console.log('🧪 场景测试结果:', scenarioTests)
  
  return {
    endpoint: endpointInfo,
    connection: connectionTest,
    scenarios: scenarioTests
  }
}

export default ApifoxAuthService

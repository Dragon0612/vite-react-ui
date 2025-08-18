import { UserService } from './UserService'
import { createSmartApiCall, APIFOX_PROJECT_INFO, createApifoxApi } from '../apifox.config'

/**
 * 增强的用户服务 - 集成 Apifox Mock
 * 基于原有 UserService，添加智能 Mock 支持
 */
export class ApifoxUserService extends UserService {
  constructor(baseURL, options = {}) {
    super(baseURL, options)
    this.apifoxApi = createApifoxApi(APIFOX_PROJECT_INFO.endpoints.users)
  }

  /**
   * 智能获取用户列表 - 支持 Apifox Mock
   */
  async getUsers(params = {}) {
    return createSmartApiCall(
      // 真实 API 调用
      () => super.getUsers(params),
      // Apifox Mock 端点
      APIFOX_PROJECT_INFO.endpoints.users
    )()
  }

  /**
   * 智能获取用户详情 - 支持 Apifox Mock
   */
  async getUserById(userId) {
    return createSmartApiCall(
      () => super.getUserById(userId),
      `${APIFOX_PROJECT_INFO.endpoints.users}/${userId}`
    )()
  }

  /**
   * 智能创建用户 - 支持 Apifox Mock
   */
  async createUser(userData) {
    return createSmartApiCall(
      () => super.createUser(userData),
      APIFOX_PROJECT_INFO.endpoints.users
    )()
  }

  /**
   * 智能更新用户 - 支持 Apifox Mock
   */
  async updateUser(userId, userData) {
    return createSmartApiCall(
      () => super.updateUser(userId, userData),
      `${APIFOX_PROJECT_INFO.endpoints.users}/${userId}`
    )()
  }

  /**
   * 智能删除用户 - 支持 Apifox Mock
   */
  async deleteUser(userId) {
    return createSmartApiCall(
      () => super.deleteUser(userId),
      `${APIFOX_PROJECT_INFO.endpoints.users}/${userId}`
    )()
  }

  /**
   * 智能获取用户统计 - 支持 Apifox Mock
   */
  async getUserStats() {
    return createSmartApiCall(
      () => super.getUserStats(),
      APIFOX_PROJECT_INFO.endpoints.userStats
    )()
  }

  /**
   * 直接使用 Apifox Mock 获取用户数据
   * 用于测试和开发
   */
  async getMockUsers(params = {}) {
    try {
      const response = await this.apifoxApi.get(params)
      console.log('🎭 使用 Apifox Mock 数据:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Apifox Mock 调用失败:', error)
      throw error
    }
  }

  /**
   * 直接使用 Apifox Mock 创建用户
   * 用于测试和开发
   */
  async createMockUser(userData) {
    try {
      const response = await this.apifoxApi.post(userData)
      console.log('🎭 Apifox Mock 创建用户:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Apifox Mock 创建用户失败:', error)
      throw error
    }
  }

  /**
   * 获取 Apifox 项目信息
   */
  getApifoxInfo() {
    return {
      projectId: APIFOX_PROJECT_INFO.id,
      projectName: APIFOX_PROJECT_INFO.name,
      projectUrl: APIFOX_PROJECT_INFO.url,
      mockUrl: APIFOX_PROJECT_INFO.mockUrl,
      endpoints: APIFOX_PROJECT_INFO.endpoints
    }
  }

  /**
   * 测试 Apifox 连接
   */
  async testApifoxConnection() {
    try {
      console.log('🔍 测试 Apifox Mock 连接...')
      const response = await this.apifoxApi.get({ limit: 1 })
      console.log('✅ Apifox Mock 连接成功:', response.status)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Apifox Mock 连接失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * 演示方法：对比真实 API 和 Mock API 的响应
   */
  async compareApiResponses(params = {}) {
    console.log('📊 开始 API 响应对比测试...')
    
    const results = {
      timestamp: new Date().toISOString(),
      params,
      real: null,
      mock: null,
      comparison: null
    }

    try {
      // 尝试调用真实 API
      console.log('📡 调用真实 API...')
      const realResponse = await super.getUsers(params)
      results.real = {
        success: true,
        data: realResponse,
        responseTime: Date.now()
      }
      console.log('✅ 真实 API 响应成功')
    } catch (error) {
      results.real = {
        success: false,
        error: error.message,
        responseTime: Date.now()
      }
      console.log('❌ 真实 API 响应失败:', error.message)
    }

    try {
      // 调用 Mock API
      console.log('🎭 调用 Apifox Mock API...')
      const mockResponse = await this.getMockUsers(params)
      results.mock = {
        success: true,
        data: mockResponse,
        responseTime: Date.now()
      }
      console.log('✅ Mock API 响应成功')
    } catch (error) {
      results.mock = {
        success: false,
        error: error.message,
        responseTime: Date.now()
      }
      console.log('❌ Mock API 响应失败:', error.message)
    }

    // 生成对比报告
    results.comparison = {
      bothSuccessful: results.real?.success && results.mock?.success,
      dataStructureSimilar: results.real?.success && results.mock?.success ? 
        this._compareDataStructure(results.real.data, results.mock.data) : false,
      recommendation: this._getRecommendation(results)
    }

    console.log('📋 API 对比报告:', results)
    return results
  }

  /**
   * 私有方法：比较数据结构
   */
  _compareDataStructure(realData, mockData) {
    try {
      const realKeys = Object.keys(realData || {}).sort()
      const mockKeys = Object.keys(mockData || {}).sort()
      return JSON.stringify(realKeys) === JSON.stringify(mockKeys)
    } catch (error) {
      return false
    }
  }

  /**
   * 私有方法：生成使用建议
   */
  _getRecommendation(results) {
    if (results.real?.success && results.mock?.success) {
      return '✅ 真实 API 和 Mock API 都可用，建议在开发时使用 Mock API'
    } else if (results.mock?.success && !results.real?.success) {
      return '🎭 仅 Mock API 可用，建议在开发时使用 Apifox Mock'
    } else if (results.real?.success && !results.mock?.success) {
      return '📡 仅真实 API 可用，建议检查 Apifox Mock 配置'
    } else {
      return '❌ 真实 API 和 Mock API 都不可用，请检查网络和配置'
    }
  }
}

// 创建增强的用户服务实例
export const apifoxUserService = new ApifoxUserService()

// 导出便捷方法
export const testApifoxIntegration = async () => {
  console.log('🚀 开始 Apifox 集成测试...')
  
  const service = new ApifoxUserService()
  
  // 1. 测试连接
  const connectionTest = await service.testApifoxConnection()
  console.log('🔗 连接测试结果:', connectionTest)
  
  // 2. 获取项目信息
  const projectInfo = service.getApifoxInfo()
  console.log('📋 项目信息:', projectInfo)
  
  // 3. 对比 API 响应
  const comparison = await service.compareApiResponses({ page: 1, pageSize: 5 })
  console.log('📊 API 对比结果:', comparison)
  
  return {
    connection: connectionTest,
    project: projectInfo,
    comparison
  }
}

export default ApifoxUserService

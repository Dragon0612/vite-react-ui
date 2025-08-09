import { BaseApiService } from '../BaseApiService'
import { PaginationParams, PaginatedResponse, ApiResponse } from '../types'
import { API_ENDPOINTS } from '../config'

/**
 * 用户管理服务
 * 提供用户相关的所有API操作
 */
export class UserService extends BaseApiService {
  constructor(baseURL, options = {}) {
    super(baseURL, options)
    this.endpoints = API_ENDPOINTS.USER
  }

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页大小
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.status - 用户状态
   * @param {string} params.role - 用户角色
   * @param {string} params.sortBy - 排序字段
   * @param {string} params.sortOrder - 排序方向
   * @returns {Promise<PaginatedResponse>}
   */
  async getUsers(params = {}) {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      status = '',
      role = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('pageSize', pageSize.toString())
    
    if (keyword) queryParams.append('keyword', keyword)
    if (status) queryParams.append('status', status)
    if (role) queryParams.append('role', role)
    if (sortBy) queryParams.append('sortBy', sortBy)
    if (sortOrder) queryParams.append('sortOrder', sortOrder)

    const response = await this.get(`${this.endpoints.LIST}?${queryParams.toString()}`)
    return PaginatedResponse.fromResponse(response)
  }

  /**
   * 获取用户详情
   * @param {string|number} userId - 用户ID
   * @returns {Promise<Object>}
   */
  async getUserById(userId) {
    const response = await this.get(`${this.endpoints.LIST}/${userId}`)
    return response.data
  }

  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    const response = await this.post(this.endpoints.CREATE, userData)
    return response.data
  }

  /**
   * 更新用户
   * @param {string|number} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>}
   */
  async updateUser(userId, userData) {
    const response = await this.put(this.endpoints.UPDATE(userId), userData)
    return response.data
  }

  /**
   * 删除用户
   * @param {string|number} userId - 用户ID
   * @returns {Promise<boolean>}
   */
  async deleteUser(userId) {
    const response = await this.delete(this.endpoints.DELETE(userId))
    return response.success
  }

  /**
   * 批量删除用户
   * @param {Array<string|number>} userIds - 用户ID数组
   * @returns {Promise<Object>}
   */
  async batchDeleteUsers(userIds) {
    const response = await this.post(this.endpoints.BATCH_DELETE, { userIds })
    return response.data
  }

  /**
   * 导出用户数据
   * @param {Object} params - 导出参数
   * @returns {Promise<Blob>}
   */
  async exportUsers(params = {}) {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key])
      }
    })

    const response = await this.download(`${this.endpoints.EXPORT}?${queryParams.toString()}`)
    return response
  }

  /**
   * 导入用户数据
   * @param {File} file - 导入文件
   * @param {Object} options - 导入选项
   * @returns {Promise<Object>}
   */
  async importUsers(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    // 添加导入选项
    Object.keys(options).forEach(key => {
      formData.append(key, options[key])
    })

    const response = await this.upload(this.endpoints.IMPORT, formData)
    return response.data
  }

  /**
   * 获取用户统计信息
   * @returns {Promise<Object>}
   */
  async getUserStats() {
    const response = await this.get(`${this.endpoints.LIST}/stats`)
    return response.data
  }

  /**
   * 重置用户密码
   * @param {string|number} userId - 用户ID
   * @param {string} newPassword - 新密码
   * @returns {Promise<boolean>}
   */
  async resetUserPassword(userId, newPassword) {
    const response = await this.post(`${this.endpoints.LIST}/${userId}/reset-password`, {
      newPassword
    })
    return response.success
  }

  /**
   * 锁定/解锁用户
   * @param {string|number} userId - 用户ID
   * @param {boolean} locked - 是否锁定
   * @returns {Promise<boolean>}
   */
  async toggleUserLock(userId, locked) {
    const response = await this.post(`${this.endpoints.LIST}/${userId}/toggle-lock`, {
      locked
    })
    return response.success
  }

  /**
   * 分配用户角色
   * @param {string|number} userId - 用户ID
   * @param {Array<string>} roles - 角色数组
   * @returns {Promise<boolean>}
   */
  async assignUserRoles(userId, roles) {
    const response = await this.post(`${this.endpoints.LIST}/${userId}/assign-roles`, {
      roles
    })
    return response.success
  }

  /**
   * 获取用户权限
   * @param {string|number} userId - 用户ID
   * @returns {Promise<Array>}
   */
  async getUserPermissions(userId) {
    const response = await this.get(`${this.endpoints.LIST}/${userId}/permissions`)
    return response.data
  }

  /**
   * 搜索用户
   * @param {string} keyword - 搜索关键词
   * @param {Object} options - 搜索选项
   * @returns {Promise<Array>}
   */
  async searchUsers(keyword, options = {}) {
    const { limit = 20, fields = ['username', 'email', 'nickname'] } = options
    
    const queryParams = new URLSearchParams()
    queryParams.append('keyword', keyword)
    queryParams.append('limit', limit.toString())
    queryParams.append('fields', fields.join(','))

    const response = await this.get(`${this.endpoints.LIST}/search?${queryParams.toString()}`)
    return response.data
  }

  /**
   * 验证用户名是否可用
   * @param {string} username - 用户名
   * @returns {Promise<boolean>}
   */
  async checkUsernameAvailability(username) {
    try {
      await this.get(`${this.endpoints.LIST}/check-username?username=${encodeURIComponent(username)}`)
      return true
    } catch (error) {
      if (error.response?.status === 409) {
        return false
      }
      throw error
    }
  }

  /**
   * 验证邮箱是否可用
   * @param {string} email - 邮箱
   * @returns {Promise<boolean>}
   */
  async checkEmailAvailability(email) {
    try {
      await this.get(`${this.endpoints.LIST}/check-email?email=${encodeURIComponent(email)}`)
      return true
    } catch (error) {
      if (error.response?.status === 409) {
        return false
      }
      throw error
    }
  }

  /**
   * 获取用户在线状态
   * @param {Array<string|number>} userIds - 用户ID数组
   * @returns {Promise<Object>}
   */
  async getUsersOnlineStatus(userIds) {
    const response = await this.post(`${this.endpoints.LIST}/online-status`, { userIds })
    return response.data
  }

  /**
   * 强制用户下线
   * @param {string|number} userId - 用户ID
   * @returns {Promise<boolean>}
   */
  async forceUserOffline(userId) {
    const response = await this.post(`${this.endpoints.LIST}/${userId}/force-offline`)
    return response.success
  }
}

// 创建默认用户服务实例
export const userService = new UserService()

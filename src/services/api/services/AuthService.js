import { BaseApiService } from '../BaseApiService'
import { API_ENDPOINTS } from '../config'

/**
 * 认证服务
 * 处理用户认证相关的所有操作
 */
export class AuthService extends BaseApiService {
  constructor(baseURL, options = {}) {
    super(baseURL, options)
    this.endpoints = API_ENDPOINTS.AUTH
  }

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.username - 用户名/邮箱
   * @param {string} credentials.password - 密码
   * @param {boolean} credentials.rememberMe - 是否记住我
   * @returns {Promise<Object>}
   */
  async login(credentials) {
    const { username, password, rememberMe = false } = credentials
    
    const response = await this.post(this.endpoints.LOGIN, {
      username,
      password,
      rememberMe
    })

    // 保存认证信息到本地存储
    if (response.success && response.data) {
      const { token, refreshToken, user } = response.data
      
      localStorage.setItem('token', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(user))
      
      // 设置token过期时间
      if (response.data.expiresIn) {
        const expiresAt = Date.now() + response.data.expiresIn * 1000
        localStorage.setItem('tokenExpiresAt', expiresAt.toString())
      }
    }

    return response
  }

  /**
   * 用户注册
   * @param {Object} userData - 用户注册数据
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @param {string} userData.confirmPassword - 确认密码
   * @param {string} userData.nickname - 昵称
   * @param {string} userData.phone - 手机号
   * @returns {Promise<Object>}
   */
  async register(userData) {
    const response = await this.post(this.endpoints.REGISTER, userData)
    return response
  }

  /**
   * 用户登出
   * @returns {Promise<Object>}
   */
  async logout() {
    try {
      // 调用后端登出接口
      await this.post(this.endpoints.LOGOUT)
    } catch (error) {
      console.warn('登出接口调用失败:', error)
    } finally {
      // 清除本地存储的认证信息
      this.clearAuthData()
    }

    return { success: true, message: '登出成功' }
  }

  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshToken) {
    const response = await this.post(this.endpoints.REFRESH, { refreshToken })
    
    if (response.success && response.data) {
      const { token, newRefreshToken, expiresIn } = response.data
      
      // 更新本地存储的token
      localStorage.setItem('token', token)
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
      }
      
      // 更新过期时间
      if (expiresIn) {
        const expiresAt = Date.now() + expiresIn * 1000
        localStorage.setItem('tokenExpiresAt', expiresAt.toString())
      }
    }

    return response
  }

  /**
   * 忘记密码
   * @param {string} email - 邮箱地址
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    const response = await this.post(this.endpoints.FORGOT_PASSWORD, { email })
    return response
  }

  /**
   * 重置密码
   * @param {string} token - 重置令牌
   * @param {string} newPassword - 新密码
   * @param {string} confirmPassword - 确认密码
   * @returns {Promise<Object>}
   */
  async resetPassword(token, newPassword, confirmPassword) {
    const response = await this.post(this.endpoints.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword
    })
    return response
  }

  /**
   * 验证邮箱
   * @param {string} token - 验证令牌
   * @returns {Promise<Object>}
   */
  async verifyEmail(token) {
    const response = await this.post(this.endpoints.VERIFY_EMAIL, { token })
    return response
  }

  /**
   * 修改密码
   * @param {string} currentPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @param {string} confirmPassword - 确认密码
   * @returns {Promise<Object>}
   */
  async changePassword(currentPassword, newPassword, confirmPassword) {
    const response = await this.post(this.endpoints.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
      confirmPassword
    })
    return response
  }

  /**
   * 检查用户是否已认证
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken()
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    
    if (!token) {
      return false
    }
    
    // 检查token是否过期
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      this.clearAuthData()
      return false
    }
    
    return true
  }

  /**
   * 获取当前用户信息
   * @returns {Object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        return null
      }
    }
    return null
  }

  /**
   * 获取访问令牌
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token')
  }

  /**
   * 获取刷新令牌
   * @returns {string|null}
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  /**
   * 检查token是否即将过期
   * @param {number} threshold - 提前警告的阈值（毫秒），默认5分钟
   * @returns {boolean}
   */
  isTokenExpiringSoon(threshold = 5 * 60 * 1000) {
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    if (!expiresAt) {
      return false
    }
    
    const timeUntilExpiry = parseInt(expiresAt) - Date.now()
    return timeUntilExpiry <= threshold
  }

  /**
   * 清除认证数据
   */
  clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('tokenExpiresAt')
  }

  /**
   * 更新用户信息
   * @param {Object} userData - 用户数据
   */
  updateUserInfo(userData) {
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  /**
   * 检查用户权限
   * @param {string|Array<string>} permissions - 权限名称或权限数组
   * @returns {boolean}
   */
  hasPermission(permissions) {
    const currentUser = this.getCurrentUser()
    if (!currentUser || !currentUser.permissions) {
      return false
    }

    const userPermissions = currentUser.permissions
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions]
    
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )
  }

  /**
   * 检查用户角色
   * @param {string|Array<string>} roles - 角色名称或角色数组
   * @returns {boolean}
   */
  hasRole(roles) {
    const currentUser = this.getCurrentUser()
    if (!currentUser || !currentUser.roles) {
      return false
    }

    const userRoles = currentUser.roles
    const requiredRoles = Array.isArray(roles) ? roles : [roles]
    
    return requiredRoles.some(role => 
      userRoles.includes(role)
    )
  }

  /**
   * 获取用户菜单权限
   * @returns {Array}
   */
  getUserMenus() {
    const currentUser = this.getCurrentUser()
    return currentUser?.menus || []
  }

  /**
   * 检查路由权限
   * @param {string} route - 路由路径
   * @returns {boolean}
   */
  hasRoutePermission(route) {
    const menus = this.getUserMenus()
    return menus.some(menu => 
      menu.path === route || 
      (menu.children && menu.children.some(child => child.path === route))
    )
  }

  /**
   * 获取认证状态信息
   * @returns {Object}
   */
  getAuthStatus() {
    const isAuth = this.isAuthenticated()
    const currentUser = this.getCurrentUser()
    const token = this.getToken()
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    
    return {
      isAuthenticated: isAuth,
      user: currentUser,
      hasToken: !!token,
      expiresAt: expiresAt ? new Date(parseInt(expiresAt)) : null,
      isExpiringSoon: this.isTokenExpiringSoon()
    }
  }
}

// 创建默认认证服务实例
export const authService = new AuthService()

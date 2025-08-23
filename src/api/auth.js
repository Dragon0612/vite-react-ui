/**
 * 认证API服务
 * 使用统一的HTTP配置处理认证相关请求
 */

import { http, setAuthToken, clearAuth, getAuthToken } from '../config'

/**
 * 认证API服务 - 简洁格式
 */
export const authApi = {
  // 用户登录
  login: (query) => http.post('/auth/login', query),
  
  // 用户注册  
  register: (query) => http.post('/auth/register', query),
  
  // 用户登出
  logout: () => http.post('/auth/logout'),
  
  // 刷新Token
  refreshToken: () => http.post('/auth/refresh'),
  
  // 忘记密码
  forgotPassword: (query) => http.post('/auth/forgot-password', query),
  
  // 重置密码
  resetPassword: (query) => http.post('/auth/reset-password', query),
  
  // 修改密码
  changePassword: (query) => http.post('/auth/change-password', query),
  
  // 验证邮箱
  verifyEmail: (query) => http.post('/auth/verify-email', query)
}

/**
 * 认证服务（带业务逻辑）
 */
export const authService = {
  /**
   * 用户登录（自动处理token）
   */
  async login(credentials) {
    const response = await authApi.login(credentials)
    
    // 登录成功后设置token
    if (response.token) {
      setAuthToken(response.token)
    }
    
    return response
  },

  /**
   * 用户登出（自动清理token）
   */
  async logout() {
    try {
      const response = await authApi.logout()
      return response
    } finally {
      // 无论请求是否成功都清除本地认证信息
      clearAuth()
    }
  },

  /**
   * 刷新Token（自动更新token）
   */
  async refreshToken() {
    const response = await authApi.refreshToken()
    
    if (response.token) {
      setAuthToken(response.token)
    }
    
    return response
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated() {
    return !!getAuthToken()
  },

  /**
   * 获取当前token
   */
  getToken() {
    return getAuthToken()
  },

  /**
   * 清除认证信息
   */
  clearAuth() {
    clearAuth()
  },

  // 其他API直接透传
  register: authApi.register,
  forgotPassword: authApi.forgotPassword,
  resetPassword: authApi.resetPassword,
  changePassword: authApi.changePassword,
  verifyEmail: authApi.verifyEmail
}

// 兼容性导出（与原有API保持一致）
export const login = authService.login
export const logout = authService.logout
export const register = authService.register
export const refreshToken = authService.refreshToken
export const forgotPassword = authService.forgotPassword
export const resetPassword = authService.resetPassword
export const changePassword = authService.changePassword
export const verifyEmail = authService.verifyEmail

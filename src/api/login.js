/**
 * 登录相关API接口
 * 纯API调用层，不处理业务逻辑
 */

import { BaseApiService } from '@/services/api/BaseApiService'

// 创建认证API服务实例
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const authApiService = new BaseApiService(API_BASE_URL)

// API路径
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  USER_INFO: '/auth/user'
}

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名/邮箱
 * @param {string} credentials.password - 密码  
 * @param {boolean} credentials.rememberMe - 是否记住我
 * @returns {Promise<Object>} 登录结果
 */
export const login = (credentials) => {
  return authApiService.post(AUTH_ENDPOINTS.LOGIN, credentials)
}

/**
 * 用户注册
 * @param {Object} userData - 注册数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @param {string} userData.confirmPassword - 确认密码
 * @param {string} userData.nickname - 昵称
 * @param {string} userData.phone - 手机号
 * @returns {Promise<Object>} 注册结果
 */
export const register = (userData) => {
  return authApiService.post(AUTH_ENDPOINTS.REGISTER, userData)
}

/**
 * 用户登出
 * @returns {Promise<Object>} 登出结果
 */
export const logout = () => {
  return authApiService.post(AUTH_ENDPOINTS.LOGOUT)
}

/**
 * 刷新token
 * @returns {Promise<Object>} 刷新结果
 */
export const refreshToken = () => {
  return authApiService.post(AUTH_ENDPOINTS.REFRESH)
}

/**
 * 忘记密码
 * @param {string} email - 邮箱地址
 * @returns {Promise<Object>} 处理结果
 */
export const forgotPassword = (email) => {
  return authApiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email })
}

/**
 * 重置密码
 * @param {Object} resetData - 重置数据
 * @param {string} resetData.token - 重置token
 * @param {string} resetData.password - 新密码
 * @param {string} resetData.confirmPassword - 确认密码
 * @returns {Promise<Object>} 重置结果
 */
export const resetPassword = (resetData) => {
  return authApiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData)
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.oldPassword - 旧密码
 * @param {string} passwordData.newPassword - 新密码
 * @param {string} passwordData.confirmPassword - 确认密码
 * @returns {Promise<Object>} 修改结果
 */
export const changePassword = (passwordData) => {
  return authApiService.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData)
}

/**
 * 验证邮箱
 * @param {string} token - 验证token
 * @returns {Promise<Object>} 验证结果
 */
export const verifyEmail = (token) => {
  return authApiService.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token })
}

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = () => {
  return authApiService.get(AUTH_ENDPOINTS.USER_INFO)
}

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserInfo = (userData) => {
  return authApiService.put(AUTH_ENDPOINTS.USER_INFO, userData)
}

// 默认导出登录API对象
const loginApi = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  getUserInfo,
  updateUserInfo
}

export default loginApi

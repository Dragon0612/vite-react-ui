/**
 * API服务统一入口
 * 导出所有API服务模块
 */

// 导出简洁格式API
export { authApi, authService, login, logout, register, refreshToken, forgotPassword, resetPassword, changePassword, verifyEmail } from './auth'
export { userApi, userService, getUserInfo, updateUserInfo, getUserPermissions, getUserMenus } from './user'

// 导出HTTP配置
export { http, httpInstance, HTTP_CONFIG, createCancelToken, isCancelError, setAuthToken, getAuthToken, clearAuth } from '../config'

// 创建API集合对象（简洁格式）
import { authApi } from './auth'
import { userApi } from './user'

export const api = {
  auth: authApi,
  user: userApi
}

// 创建服务集合对象（兼容格式）
import { authService } from './auth'
import { userService } from './user'

export const services = {
  auth: authService,
  user: userService
}

// 默认导出HTTP实例
export { default as http } from '../config'

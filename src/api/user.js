/**
 * 用户API服务
 * 使用统一的HTTP配置处理用户相关请求
 */

import { http } from '../config'

/**
 * 用户API服务 - 简洁格式
 */
export const userApi = {
  // 获取当前用户信息
  getCurrentUserInfo: () => http.get('/user/info'),
  
  // 获取用户详细档案
  getUserProfile: () => http.get('/user/profile'),
  
  // 更新用户信息
  updateUserInfo: (query) => http.put('/user/update', query),
  
  // 获取用户权限
  getUserPermissions: () => http.get('/user/permissions'),
  
  // 获取用户菜单
  getUserMenus: () => http.get('/user/menus'),
  
  // 上传用户头像
  uploadAvatar: (query) => http.upload('/user/avatar', query),
  
  // 获取用户列表（管理员功能）
  getUserList: (query = {}) => http.get('/users', query),
  
  // 创建用户（管理员功能）
  createUser: (query) => http.post('/users', query),
  
  // 更新用户（管理员功能）
  updateUser: (userId, query) => http.put(`/users/${userId}`, query),
  
  // 删除用户（管理员功能）
  deleteUser: (userId) => http.delete(`/users/${userId}`),
  
  // 批量删除用户（管理员功能）
  batchDeleteUsers: (query) => http.post('/users/batch', query),
  
  // 导出用户数据（管理员功能）
  exportUsers: (query = {}) => http.download('/users/export', query, 'users.xlsx'),
  
  // 导入用户数据（管理员功能）
  importUsers: (query) => http.upload('/users/import', query)
}

/**
 * 用户服务（兼容性包装）
 */
export const userService = {
  getCurrentUserInfo: userApi.getCurrentUserInfo,
  getUserProfile: userApi.getUserProfile,
  updateUserInfo: userApi.updateUserInfo,
  getUserPermissions: userApi.getUserPermissions,
  getUserMenus: userApi.getUserMenus,
  uploadAvatar: userApi.uploadAvatar,
  getUserList: userApi.getUserList,
  createUser: userApi.createUser,
  updateUser: userApi.updateUser,
  deleteUser: userApi.deleteUser,
  batchDeleteUsers: userApi.batchDeleteUsers,
  exportUsers: userApi.exportUsers,
  importUsers: userApi.importUsers
}

// 兼容性导出（与原有API保持一致）
export const getUserInfo = userService.getCurrentUserInfo
export const updateUserInfo = userService.updateUserInfo
export const getUserPermissions = userService.getUserPermissions
export const getUserMenus = userService.getUserMenus

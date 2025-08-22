/**
 * 用户信息相关API接口
 * 纯API调用层，不处理业务逻辑
 */

import { BaseApiService } from '@/services/api/BaseApiService'

// 创建用户信息API服务实例 - 使用Apifox Mock地址
const API_BASE_URL = 'https://m1.apifoxmock.com/m1/6491710-6191887-default'
const userInfoApiService = new BaseApiService(API_BASE_URL)

// API路径
const USER_INFO_ENDPOINTS = {
  USER_INFO: '/system/userInfo',
  USER_PERMISSIONS: '/system/userPermissions', 
  USER_MENUS: '/system/userMenus',
  USER_PROFILE: '/user/profile'
}

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = () => {
  return userInfoApiService.get(USER_INFO_ENDPOINTS.USER_INFO + '?apifoxToken=shpT2Zh4YXB4oeDJ44Q47')
}

/**
 * 更新用户信息
 * @param {Object} userInfo - 用户信息数据
 * @param {string} userInfo.name - 姓名
 * @param {string} userInfo.mobile - 手机号
 * @param {string} userInfo.department - 部门
 * @param {string} userInfo.role - 角色
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserInfo = (userInfo) => {
  return userInfoApiService.put(USER_INFO_ENDPOINTS.USER_INFO + '?apifoxToken=shpT2Zh4YXB4oeDJ44Q47', userInfo)
}

/**
 * 获取用户权限
 * @returns {Promise<Object>} 用户权限
 */
export const getUserPermissions = () => {
  return userInfoApiService.get(USER_INFO_ENDPOINTS.USER_PERMISSIONS + '?apifoxToken=shpT2Zh4YXB4oeDJ44Q47')
}

/**
 * 获取用户菜单
 * @returns {Promise<Object>} 用户菜单
 */
export const getUserMenus = () => {
  return userInfoApiService.get(USER_INFO_ENDPOINTS.USER_MENUS + '?apifoxToken=shpT2Zh4YXB4oeDJ44Q47')
}

/**
 * 获取用户详细档案
 * @returns {Promise<Object>} 用户档案
 */
export const getUserProfile = () => {
  return userInfoApiService.get(USER_INFO_ENDPOINTS.USER_PROFILE + '?apifoxToken=shpT2Zh4YXB4oeDJ44Q47')
}

// 默认导出用户信息API对象
const userInfoApi = {
  getUserInfo,
  updateUserInfo,
  getUserPermissions,
  getUserMenus,
  getUserProfile
}

export default userInfoApi

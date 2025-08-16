import { useCallback } from 'react'
import { usePermissionStore } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'

/**
 * 权限检查 Hook
 * @returns {object} 权限检查方法
 */
export const usePermission = () => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    canAccessMenu,
    getUserPermissions,
    getUserMenus
  } = usePermissionStore()

  /**
   * 检查单个权限
   * @param {string} permissionCode - 权限代码
   * @returns {boolean} 是否有权限
   */
  const checkPermission = useCallback((permissionCode) => {
    return hasPermission(permissionCode)
  }, [hasPermission])

  /**
   * 检查多个权限（任一权限即可）
   * @param {string[]} permissionCodes - 权限代码数组
   * @returns {boolean} 是否有任一权限
   */
  const checkAnyPermission = useCallback((permissionCodes) => {
    return hasAnyPermission(permissionCodes)
  }, [hasAnyPermission])

  /**
   * 检查多个权限（需要所有权限）
   * @param {string[]} permissionCodes - 权限代码数组
   * @returns {boolean} 是否有所有权限
   */
  const checkAllPermissions = useCallback((permissionCodes) => {
    return hasAllPermissions(permissionCodes)
  }, [hasAllPermissions])

  /**
   * 检查菜单访问权限
   * @param {string} menuPath - 菜单路径
   * @returns {boolean} 是否可以访问菜单
   */
  const checkMenuAccess = useCallback((menuPath) => {
    return canAccessMenu(menuPath)
  }, [canAccessMenu])

  /**
   * 获取当前用户的所有权限
   * @returns {string[]} 权限代码数组
   */
  const getCurrentUserPermissions = useCallback(() => {
    return getUserPermissions()
  }, [getUserPermissions])

  /**
   * 获取当前用户可访问的菜单
   * @returns {string[]} 可访问的菜单路径数组
   */
  const getCurrentUserMenus = useCallback(() => {
    return getUserMenus()
  }, [getUserMenus])

  /**
   * 检查是否为超级管理员
   * @returns {boolean} 是否为超级管理员
   */
  const isSuperAdmin = useCallback(() => {
    const { userInfo } = useUserStore.getState()
    return userInfo?.role === 'super_admin'
  }, [])

  /**
   * 检查是否为管理员
   * @returns {boolean} 是否为管理员
   */
  const isAdmin = useCallback(() => {
    const { userInfo } = useUserStore.getState()
    return userInfo?.role === 'admin' || userInfo?.role === 'super_admin'
  }, [])

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkMenuAccess,
    getCurrentUserPermissions,
    getCurrentUserMenus,
    isSuperAdmin,
    isAdmin
  }
}

export default usePermission

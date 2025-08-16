import React from 'react'
import { Tooltip } from 'antd'
import { usePermissionStore } from '@/store/zustand'

/**
 * 权限包装组件
 * @param {string} permission - 所需权限代码
 * @param {string[]} permissions - 所需权限代码数组（任一权限即可）
 * @param {boolean} requireAll - 是否需要所有权限（默认false，任一权限即可）
 * @param {React.ReactNode} children - 子组件
 * @param {React.ReactNode} fallback - 无权限时显示的组件
 * @param {string} noPermissionText - 无权限时的提示文本
 * @param {boolean} showTooltip - 是否显示无权限提示
 * @param {boolean} hideOnNoPermission - 无权限时是否隐藏（默认true）
 */
const PermissionWrapper = ({
  permission,
  permissions = [],
  requireAll = false,
  children,
  fallback = null,
  noPermissionText = '您没有权限访问此内容',
  showTooltip = true,
  hideOnNoPermission = true,
  ...rest
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissionStore()
  
  // 确定需要检查的权限
  const permissionCodes = permissions.length > 0 ? permissions : [permission]
  
  // 检查权限
  let hasAccess = false
  if (requireAll) {
    hasAccess = hasAllPermissions(permissionCodes)
  } else {
    hasAccess = hasAnyPermission(permissionCodes)
  }
  
  // 如果没有权限
  if (!hasAccess) {
    if (hideOnNoPermission) {
      return null
    }
    
    if (showTooltip) {
      return (
        <Tooltip title={noPermissionText}>
          <span>
            {fallback}
          </span>
        </Tooltip>
      )
    }
    
    return fallback
  }
  
  // 有权限，正常显示子组件
  return <>{children}</>
}

export default PermissionWrapper

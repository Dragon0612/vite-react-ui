import React from 'react'
import { Button, Tooltip } from 'antd'
import { usePermissionStore } from '@/store/zustand'

/**
 * 权限控制按钮组件
 * @param {string} permission - 所需权限代码
 * @param {string[]} permissions - 所需权限代码数组（任一权限即可）
 * @param {boolean} requireAll - 是否需要所有权限（默认false，任一权限即可）
 * @param {React.ReactNode} children - 按钮内容
 * @param {object} buttonProps - 按钮属性
 * @param {string} noPermissionText - 无权限时的提示文本
 * @param {boolean} showTooltip - 是否显示无权限提示
 */
const PermissionButton = ({
  permission,
  permissions = [],
  requireAll = false,
  children,
  buttonProps = {},
  noPermissionText = '您没有权限执行此操作',
  showTooltip = true,
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
  
  // 如果没有权限，返回null或禁用按钮
  if (!hasAccess) {
    if (showTooltip) {
      return (
        <Tooltip title={noPermissionText}>
          <span>
            <Button {...buttonProps} disabled {...rest}>
              {children}
            </Button>
          </span>
        </Tooltip>
      )
    }
    return null
  }
  
  // 有权限，正常显示按钮
  return (
    <Button {...buttonProps} {...rest}>
      {children}
    </Button>
  )
}

export default PermissionButton

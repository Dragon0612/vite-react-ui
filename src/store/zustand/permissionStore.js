import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore'

// 权限类型定义
export const PERMISSION_TYPES = {
  MENU: 'menu',           // 菜单权限
  BUTTON: 'button',       // 按钮权限
  API: 'api',            // API权限
  DATA: 'data'           // 数据权限
}

// 默认角色定义
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest'
}

// 默认权限定义
export const DEFAULT_PERMISSIONS = {
  // 系统管理权限
  SYSTEM_MANAGE: 'system:manage',
  USER_MANAGE: 'user:manage',
  ROLE_MANAGE: 'role:manage',
  PERMISSION_MANAGE: 'permission:manage',
  LOG_MANAGE: 'log:manage',
  
  // 内容管理权限
  CONTENT_MANAGE: 'content:manage',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_VIEW: 'content:view',
  
  // 数据管理权限
  DATA_MANAGE: 'data:manage',
  DATA_EXPORT: 'data:export',
  DATA_IMPORT: 'data:import',
  
  // 系统监控权限
  MONITOR_VIEW: 'monitor:view',
  MONITOR_MANAGE: 'monitor:manage',
  
  // 文件管理权限
  FILE_UPLOAD: 'file:upload',
  FILE_DOWNLOAD: 'file:download',
  FILE_DELETE: 'file:delete'
}

// 角色权限映射
export const ROLE_PERMISSIONS = {
  [DEFAULT_ROLES.SUPER_ADMIN]: Object.values(DEFAULT_PERMISSIONS),
  [DEFAULT_ROLES.ADMIN]: [
    DEFAULT_PERMISSIONS.USER_MANAGE,
    DEFAULT_PERMISSIONS.CONTENT_MANAGE,
    DEFAULT_PERMISSIONS.CONTENT_CREATE,
    DEFAULT_PERMISSIONS.CONTENT_EDIT,
    DEFAULT_PERMISSIONS.CONTENT_DELETE,
    DEFAULT_PERMISSIONS.CONTENT_VIEW,
    DEFAULT_PERMISSIONS.DATA_MANAGE,
    DEFAULT_PERMISSIONS.DATA_EXPORT,
    DEFAULT_PERMISSIONS.MONITOR_VIEW,
    DEFAULT_PERMISSIONS.FILE_UPLOAD,
    DEFAULT_PERMISSIONS.FILE_DOWNLOAD
  ],
  [DEFAULT_ROLES.MANAGER]: [
    DEFAULT_PERMISSIONS.CONTENT_MANAGE,
    DEFAULT_PERMISSIONS.CONTENT_CREATE,
    DEFAULT_PERMISSIONS.CONTENT_EDIT,
    DEFAULT_PERMISSIONS.CONTENT_VIEW,
    DEFAULT_PERMISSIONS.DATA_EXPORT,
    DEFAULT_PERMISSIONS.MONITOR_VIEW,
    DEFAULT_PERMISSIONS.FILE_UPLOAD,
    DEFAULT_PERMISSIONS.FILE_DOWNLOAD
  ],
  [DEFAULT_ROLES.USER]: [
    DEFAULT_PERMISSIONS.CONTENT_VIEW,
    DEFAULT_PERMISSIONS.FILE_DOWNLOAD
  ],
  [DEFAULT_ROLES.GUEST]: [
    DEFAULT_PERMISSIONS.CONTENT_VIEW
  ]
}

export const usePermissionStore = create(
  persist(
    (set, get) => ({
      // 角色列表
      roles: [
        {
          id: '1',
          name: '超级管理员',
          code: DEFAULT_ROLES.SUPER_ADMIN,
          description: '拥有系统所有权限',
          permissions: ROLE_PERMISSIONS[DEFAULT_ROLES.SUPER_ADMIN],
          isDefault: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          name: '管理员',
          code: DEFAULT_ROLES.ADMIN,
          description: '拥有大部分管理权限',
          permissions: ROLE_PERMISSIONS[DEFAULT_ROLES.ADMIN],
          isDefault: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '3',
          name: '经理',
          code: DEFAULT_ROLES.MANAGER,
          description: '拥有内容管理权限',
          permissions: ROLE_PERMISSIONS[DEFAULT_ROLES.MANAGER],
          isDefault: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '4',
          name: '普通用户',
          code: DEFAULT_ROLES.USER,
          description: '基础查看权限',
          permissions: ROLE_PERMISSIONS[DEFAULT_ROLES.USER],
          isDefault: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ],
      
      // 权限列表
      permissions: [
        // 系统管理权限
        { id: '1', name: '系统管理', code: DEFAULT_PERMISSIONS.SYSTEM_MANAGE, type: PERMISSION_TYPES.MENU, description: '系统管理模块访问权限' },
        { id: '2', name: '用户管理', code: DEFAULT_PERMISSIONS.USER_MANAGE, type: PERMISSION_TYPES.MENU, description: '用户管理模块访问权限' },
        { id: '3', name: '角色管理', code: DEFAULT_PERMISSIONS.ROLE_MANAGE, type: PERMISSION_TYPES.MENU, description: '角色管理模块访问权限' },
        { id: '4', name: '权限管理', code: DEFAULT_PERMISSIONS.PERMISSION_MANAGE, type: PERMISSION_TYPES.MENU, description: '权限管理模块访问权限' },
        { id: '5', name: '日志管理', code: DEFAULT_PERMISSIONS.LOG_MANAGE, type: PERMISSION_TYPES.MENU, description: '日志管理模块访问权限' },
        
        // 内容管理权限
        { id: '6', name: '内容管理', code: DEFAULT_PERMISSIONS.CONTENT_MANAGE, type: PERMISSION_TYPES.MENU, description: '内容管理模块访问权限' },
        { id: '7', name: '创建内容', code: DEFAULT_PERMISSIONS.CONTENT_CREATE, type: PERMISSION_TYPES.BUTTON, description: '创建内容权限' },
        { id: '8', name: '编辑内容', code: DEFAULT_PERMISSIONS.CONTENT_EDIT, type: PERMISSION_TYPES.BUTTON, description: '编辑内容权限' },
        { id: '9', name: '删除内容', code: DEFAULT_PERMISSIONS.CONTENT_DELETE, type: PERMISSION_TYPES.BUTTON, description: '删除内容权限' },
        { id: '10', name: '查看内容', code: DEFAULT_PERMISSIONS.CONTENT_VIEW, type: PERMISSION_TYPES.BUTTON, description: '查看内容权限' },
        
        // 数据管理权限
        { id: '11', name: '数据管理', code: DEFAULT_PERMISSIONS.DATA_MANAGE, type: PERMISSION_TYPES.MENU, description: '数据管理模块访问权限' },
        { id: '12', name: '数据导出', code: DEFAULT_PERMISSIONS.DATA_EXPORT, type: PERMISSION_TYPES.BUTTON, description: '数据导出权限' },
        { id: '13', name: '数据导入', code: DEFAULT_PERMISSIONS.DATA_IMPORT, type: PERMISSION_TYPES.BUTTON, description: '数据导入权限' },
        
        // 系统监控权限
        { id: '14', name: '监控查看', code: DEFAULT_PERMISSIONS.MONITOR_VIEW, type: PERMISSION_TYPES.MENU, description: '系统监控查看权限' },
        { id: '15', name: '监控管理', code: DEFAULT_PERMISSIONS.MONITOR_MANAGE, type: PERMISSION_TYPES.MENU, description: '系统监控管理权限' },
        
        // 文件管理权限
        { id: '16', name: '文件上传', code: DEFAULT_PERMISSIONS.FILE_UPLOAD, type: PERMISSION_TYPES.BUTTON, description: '文件上传权限' },
        { id: '17', name: '文件下载', code: DEFAULT_PERMISSIONS.FILE_DOWNLOAD, type: PERMISSION_TYPES.BUTTON, description: '文件下载权限' },
        { id: '18', name: '文件删除', code: DEFAULT_PERMISSIONS.FILE_DELETE, type: PERMISSION_TYPES.BUTTON, description: '文件删除权限' }
      ],
      
      // 菜单权限配置
      menuPermissions: {
        '/system/users': [DEFAULT_PERMISSIONS.USER_MANAGE],
        '/system/roles': [DEFAULT_PERMISSIONS.ROLE_MANAGE],
        '/system/permissions': [DEFAULT_PERMISSIONS.PERMISSION_MANAGE],
        '/system/logs': [DEFAULT_PERMISSIONS.LOG_MANAGE],
        '/content/management': [DEFAULT_PERMISSIONS.CONTENT_MANAGE],
        '/content/produceInfo': [DEFAULT_PERMISSIONS.CONTENT_VIEW],
        '/performance': [DEFAULT_PERMISSIONS.MONITOR_VIEW]
      },
      
      // 操作方法
      
      // 角色管理
      addRole: (role) => set((state) => ({
        roles: [...state.roles, { ...role, id: Date.now().toString(), createdAt: new Date().toISOString() }]
      })),
      
      updateRole: (id, updates) => set((state) => ({
        roles: state.roles.map(role => 
          role.id === id ? { ...role, ...updates, updatedAt: new Date().toISOString() } : role
        )
      })),
      
      deleteRole: (id) => set((state) => ({
        roles: state.roles.filter(role => role.id !== id)
      })),
      
      getRoleById: (id) => {
        const state = get()
        return state.roles.find(role => role.id === id)
      },
      
      getRoleByCode: (code) => {
        const state = get()
        return state.roles.find(role => role.code === code)
      },
      
      // 权限管理
      addPermission: (permission) => set((state) => ({
        permissions: [...state.permissions, { ...permission, id: Date.now().toString() }]
      })),
      
      updatePermission: (id, updates) => set((state) => ({
        permissions: state.permissions.map(permission => 
          permission.id === id ? { ...permission, ...updates } : permission
        )
      })),
      
      deletePermission: (id) => set((state) => ({
        permissions: state.permissions.filter(permission => permission.id !== id)
      })),
      
      getPermissionById: (id) => {
        const state = get()
        return state.permissions.find(permission => permission.id === id)
      },
      
      getPermissionByCode: (code) => {
        const state = get()
        return state.permissions.find(permission => permission.code === code)
      },
      
      // 权限检查
      hasPermission: (permissionCode) => {
        const state = get()
        const { userInfo } = useUserStore.getState()
        const userRole = state.roles.find(role => role.code === userInfo?.role)
        return userRole?.permissions?.includes(permissionCode) || false
      },
      
      hasAnyPermission: (permissionCodes) => {
        const state = get()
        const { userInfo } = useUserStore.getState()
        const userRole = state.roles.find(role => role.code === userInfo?.role)
        return permissionCodes.some(code => userRole?.permissions?.includes(code)) || false
      },
      
      hasAllPermissions: (permissionCodes) => {
        const state = get()
        const { userInfo } = useUserStore.getState()
        const userRole = state.roles.find(role => role.code === userInfo?.role)
        return permissionCodes.every(code => userRole?.permissions?.includes(code)) || false
      },
      
      // 菜单权限检查
      canAccessMenu: (menuPath) => {
        const state = get()
        const requiredPermissions = state.menuPermissions[menuPath] || []
        if (requiredPermissions.length === 0) return true
        return state.hasAnyPermission(requiredPermissions)
      },
      
      // 获取用户权限列表
      getUserPermissions: () => {
        const state = get()
        const { userInfo } = useUserStore.getState()
        const userRole = state.roles.find(role => role.code === userInfo?.role)
        return userRole?.permissions || []
      },
      
      // 获取用户可访问的菜单
      getUserMenus: () => {
        const state = get()
        const accessibleMenus = []
        
        Object.entries(state.menuPermissions).forEach(([path, requiredPermissions]) => {
          if (state.hasAnyPermission(requiredPermissions)) {
            accessibleMenus.push(path)
          }
        })
        
        return accessibleMenus
      },
      
      // 批量更新角色权限
      updateRolePermissions: (roleId, permissions) => set((state) => ({
        roles: state.roles.map(role => 
          role.id === roleId ? { ...role, permissions, updatedAt: new Date().toISOString() } : role
        )
      })),
      
      // 重置为默认权限
      resetToDefaultPermissions: () => set((state) => ({
        roles: state.roles.map(role => ({
          ...role,
          permissions: ROLE_PERMISSIONS[role.code] || [],
          updatedAt: new Date().toISOString()
        }))
      }))
    }),
    {
      name: 'permission-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        roles: state.roles,
        permissions: state.permissions,
        menuPermissions: state.menuPermissions
      })
    }
  )
)

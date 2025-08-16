# 权限管理系统

这是一个基于 RBAC（基于角色的访问控制）模型的完整权限管理系统，提供了角色管理、权限管理、用户权限分配等功能。

## 功能特性

### 1. 角色管理
- ✅ 角色的增删改查
- ✅ 角色权限分配
- ✅ 默认角色预设
- ✅ 角色权限统计

### 2. 权限管理
- ✅ 权限的增删改查
- ✅ 权限类型分类（菜单、按钮、API、数据）
- ✅ 权限使用统计
- ✅ 权限代码规范

### 3. 用户权限分配
- ✅ 用户角色分配
- ✅ 用户权限查看
- ✅ 用户状态管理
- ✅ 批量权限操作

### 4. 权限控制组件
- ✅ PermissionButton - 权限控制按钮
- ✅ PermissionWrapper - 权限包装组件
- ✅ usePermission Hook - 权限检查工具

## 系统架构

### 权限类型
- **菜单权限**：控制页面和菜单的访问
- **按钮权限**：控制操作按钮的显示
- **API权限**：控制后端接口的访问
- **数据权限**：控制数据的访问范围

### 默认角色
- **超级管理员**：拥有所有权限
- **管理员**：拥有大部分管理权限
- **经理**：拥有内容管理权限
- **普通用户**：基础查看权限
- **访客**：最小权限

### 默认权限
系统预设了以下权限：

#### 系统管理权限
- `system:manage` - 系统管理
- `user:manage` - 用户管理
- `role:manage` - 角色管理
- `permission:manage` - 权限管理
- `log:manage` - 日志管理

#### 内容管理权限
- `content:manage` - 内容管理
- `content:create` - 创建内容
- `content:edit` - 编辑内容
- `content:delete` - 删除内容
- `content:view` - 查看内容

#### 数据管理权限
- `data:manage` - 数据管理
- `data:export` - 数据导出
- `data:import` - 数据导入

#### 系统监控权限
- `monitor:view` - 监控查看
- `monitor:manage` - 监控管理

#### 文件管理权限
- `file:upload` - 文件上传
- `file:download` - 文件下载
- `file:delete` - 文件删除

## 使用方法

### 1. PermissionButton 组件

```jsx
import PermissionButton from '@/pages/permissionManagerment/components/PermissionButton'

// 单个权限检查
<PermissionButton permission="user:manage">
  用户管理
</PermissionButton>

// 多个权限检查（任一权限即可）
<PermissionButton permissions={['user:manage', 'role:manage']}>
  系统管理
</PermissionButton>

// 需要所有权限
<PermissionButton 
  permissions={['user:manage', 'role:manage']} 
  requireAll={true}
>
  高级管理
</PermissionButton>

// 自定义按钮属性
<PermissionButton 
  permission="content:create"
  buttonProps={{
    type: 'primary',
    icon: <PlusOutlined />
  }}
>
  创建内容
</PermissionButton>
```

### 2. PermissionWrapper 组件

```jsx
import PermissionWrapper from '@/pages/permissionManagerment/components/PermissionWrapper'

// 基本使用
<PermissionWrapper permission="content:view">
  <div>只有有权限的用户才能看到此内容</div>
</PermissionWrapper>

// 设置替代内容
<PermissionWrapper 
  permission="user:manage"
  fallback={<div>您没有权限访问此内容</div>}
  hideOnNoPermission={false}
>
  <div>用户管理内容</div>
</PermissionWrapper>

// 多个权限检查
<PermissionWrapper 
  permissions={['role:manage', 'permission:manage']}
  requireAll={true}
>
  <div>需要同时拥有角色管理和权限管理权限</div>
</PermissionWrapper>
```

### 3. usePermission Hook

```jsx
import usePermission from '@/pages/permissionManagerment/hooks/usePermission'

const MyComponent = () => {
  const { 
    checkPermission, 
    checkAnyPermission, 
    checkAllPermissions,
    getCurrentUserPermissions,
    isSuperAdmin,
    isAdmin 
  } = usePermission()

  // 检查单个权限
  const canManageUsers = checkPermission('user:manage')

  // 检查多个权限（任一权限即可）
  const canManageSystem = checkAnyPermission(['user:manage', 'role:manage'])

  // 检查多个权限（需要所有权限）
  const canAdvancedManage = checkAllPermissions(['user:manage', 'role:manage'])

  // 获取当前用户所有权限
  const userPermissions = getCurrentUserPermissions()

  // 检查角色
  const isSuper = isSuperAdmin()
  const isAdminUser = isAdmin()

  return (
    <div>
      {canManageUsers && <div>用户管理功能</div>}
      {canManageSystem && <div>系统管理功能</div>}
      {canAdvancedManage && <div>高级管理功能</div>}
    </div>
  )
}
```

### 4. 权限 Store

```jsx
import { usePermissionStore } from '@/store/zustand/permissionStore'

const MyComponent = () => {
  const { 
    roles, 
    permissions, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    getUserPermissions 
  } = usePermissionStore()

  // 检查权限
  const canManageUsers = hasPermission('user:manage')

  // 获取用户权限
  const userPermissions = getUserPermissions()

  return (
    <div>
      <h3>角色列表</h3>
      {roles.map(role => (
        <div key={role.id}>{role.name}</div>
      ))}
      
      <h3>权限列表</h3>
      {permissions.map(permission => (
        <div key={permission.id}>{permission.name}</div>
      ))}
    </div>
  )
}
```

## 路由配置

权限管理页面已添加到系统路由中：

```javascript
{
  path: 'permissions',
  name: '权限管理',
  component: PermissionManagement,
  meta: {
    title: '权限管理',
    description: '系统权限和角色管理',
    icon: 'safety',
    showInMenu: true,
    requiresAuth: true,
    keepAlive: true,
    cacheKey: 'permission-management'
  }
}
```

## 菜单权限

系统会自动根据用户权限控制菜单的显示：

```javascript
// 菜单权限配置
menuPermissions: {
  '/system/users': ['user:manage'],
  '/system/roles': ['role:manage'],
  '/system/permissions': ['permission:manage'],
  '/system/logs': ['log:manage'],
  '/content/management': ['content:manage'],
  '/content/produceInfo': ['content:view'],
  '/performance': ['monitor:view']
}
```

## 最佳实践

### 1. 权限命名规范
- 使用小写字母和冒号分隔
- 格式：`模块:操作`
- 示例：`user:manage`、`content:create`、`data:export`

### 2. 权限粒度控制
- 菜单权限：控制页面访问
- 按钮权限：控制操作权限
- API权限：控制接口访问
- 数据权限：控制数据范围

### 3. 角色设计原则
- 遵循最小权限原则
- 角色职责单一
- 权限继承合理
- 便于维护管理

### 4. 性能优化
- 权限数据缓存
- 懒加载权限检查
- 批量权限验证
- 减少重复检查

## 扩展功能

### 1. 动态权限
可以扩展支持动态权限配置，从后端获取权限数据。

### 2. 权限组
可以添加权限组功能，将相关权限组织在一起。

### 3. 权限继承
可以实现权限继承机制，子角色继承父角色权限。

### 4. 权限审计
可以添加权限操作日志，记录权限变更历史。

### 5. 权限模板
可以预设权限模板，快速创建常用角色。

## 注意事项

1. **权限检查时机**：在组件渲染时进行权限检查，避免在异步操作中检查
2. **权限缓存**：合理使用权限缓存，避免频繁的权限检查
3. **错误处理**：对权限检查失败的情况进行适当的错误处理
4. **用户体验**：无权限时提供友好的提示信息
5. **安全性**：前端权限控制只是辅助，后端必须进行权限验证

## 更新日志

### v1.0.0 (2024-01-15)
- ✅ 基础权限管理系统
- ✅ 角色管理功能
- ✅ 权限管理功能
- ✅ 用户权限分配
- ✅ 权限控制组件
- ✅ 权限检查 Hook
- ✅ 权限演示页面

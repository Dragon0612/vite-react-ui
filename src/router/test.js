import { routes, getMenuItems, getRouteByPath, getAllPaths, requiresAuth } from './index'

// 测试路由配置
console.log('=== 路由配置测试 ===')

// 1. 测试路由数量
console.log(`总路由数量: ${routes.length}`)

// 2. 测试菜单项
const menuItems = getMenuItems()
console.log(`菜单项数量: ${menuItems.length}`)
console.log('菜单项:', menuItems.map(item => item.meta.title))

// 3. 测试路径获取
const allPaths = getAllPaths()
console.log('所有路径:', allPaths)

// 4. 测试路由查找
const homeRoute = getRouteByPath('/')
console.log('首页路由:', homeRoute?.meta.title)

// 5. 测试权限检查
const authRoutes = allPaths.filter(path => requiresAuth(path))
console.log('需要认证的路由:', authRoutes)

// 6. 测试路由元数据
routes.forEach(route => {
  console.log(`路由: ${route.path}`)
  console.log(`  标题: ${route.meta.title}`)
  console.log(`  图标: ${route.meta.icon}`)
  console.log(`  显示在菜单: ${route.meta.showInMenu}`)
  console.log(`  需要认证: ${route.meta.requiresAuth}`)
  console.log('---')
})

export default {
  routes,
  menuItems,
  allPaths,
  authRoutes
} 
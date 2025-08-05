import { lazy } from 'react'

// 懒加载组件
const Layout = lazy(() => import('@/components/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))

// 路由配置
export const routes = [
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: {
      title: '登录',
      icon: 'login',
      showInMenu: false,
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: '后台管理',
    component: Layout,
    meta: {
      title: '后台管理系统',
      icon: 'admin',
      showInMenu: false,
      requiresAuth: true,
      layout: 'admin'
    },
    children: [
      {
        path: '',
        name: '仪表盘',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          icon: 'dashboard',
          showInMenu: true
        }
      }
    ]
  }
]

// 获取菜单项
export const getMenuItems = () => {
  return routes.filter(route => route.meta?.showInMenu)
}

// 根据路径获取路由配置
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path)
}

// 获取所有路由路径
export const getAllPaths = () => {
  return routes.map(route => route.path)
}

// 检查路由是否需要认证
export const requiresAuth = (path) => {
  const route = getRouteByPath(path)
  return route?.meta?.requiresAuth || false
}

// 检查路由是否使用后台布局
export const useAdminLayout = (path) => {
  const route = getRouteByPath(path)
  return route?.meta?.layout === 'admin'
} 
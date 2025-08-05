import { lazy } from 'react'

// 懒加载组件
const Layout = lazy(() => import('@/components/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))
const UserManagement = lazy(() => import('@/pages/UserManagement'))
const SystemSettings = lazy(() => import('@/pages/SystemSettings'))
const DataAnalysis = lazy(() => import('@/pages/DataAnalysis'))
const ContentManagement = lazy(() => import('@/pages/ContentManagement'))
const LogManagement = lazy(() => import('@/pages/LogManagement'))

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
      },
      {
        path: 'users',
        name: '用户管理',
        component: UserManagement,
        meta: {
          title: '用户管理',
          icon: 'user',
          showInMenu: true
        }
      },
      {
        path: 'content',
        name: '内容管理',
        component: ContentManagement,
        meta: {
          title: '内容管理',
          icon: 'file',
          showInMenu: true
        }
      },
      {
        path: 'analysis',
        name: '数据分析',
        component: DataAnalysis,
        meta: {
          title: '数据分析',
          icon: 'bar-chart',
          showInMenu: true
        }
      },
      {
        path: 'logs',
        name: '日志管理',
        component: LogManagement,
        meta: {
          title: '日志管理',
          icon: 'file-text',
          showInMenu: true
        }
      },
      {
        path: 'settings',
        name: '系统设置',
        component: SystemSettings,
        meta: {
          title: '系统设置',
          icon: 'setting',
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
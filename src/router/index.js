import { lazy } from 'react'

// 懒加载组件
const Layout = lazy(() => import('@/components/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))
const UserManagement = lazy(() => import('@/pages/UserManagement'))
const SystemSettings = lazy(() => import('@/pages/SystemSettings'))
const DataAnalysis = lazy(() => import('@/pages/DataAnalysis'))
const ContentManagement = lazy(() => import('@/pages/ContentManagement'))
const ProduceInfo = lazy(() => import('@/pages/produceInfo'))
const LogManagement = lazy(() => import('@/pages/LogManagement'))
const PerformanceDemo = lazy(() => import('@/components/PerformanceDemo'))

// 路由配置
export const routes = [
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: {
      title: '登录',
      description: '用户登录页面',
      icon: 'login',
      showInMenu: false,
      requiresAuth: false,
      // 登录页面只需要基本参数，不需要用户信息
      injectParams: true,
      injectUserInfo: false,
      injectCallbacks: false
    }
  },
  {
    path: '/',
    name: '后台管理',
    component: Layout,
    meta: {
      title: '后台管理系统',
      description: '系统主布局',
      icon: 'admin',
      showInMenu: false,
      requiresAuth: true,
      layout: 'admin',
      // 布局组件需要所有参数
      injectParams: true,
      injectUserInfo: true,
      injectCallbacks: true
    },
    children: [
      {
        path: '',
        name: '仪表盘',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          description: '系统概览和统计数据',
          icon: 'dashboard',
          showInMenu: true,
          // 仪表盘需要用户信息和回调函数
          injectParams: true,
          injectUserInfo: true,
          injectCallbacks: true
        }
      },
      {
        path: 'system', // 为菜单组设置唯一路径
        name: '系统管理',
        component: null, // 父级路由不需要组件
        meta: {
          title: '系统管理',
          description: '系统相关功能管理',
          icon: 'setting',
          showInMenu: true,
          isGroup: true, // 标记为菜单组
        },
        children: [
          {
            path: 'users', // 相对于父路径的路径
            name: '用户管理',
            component: UserManagement,
            meta: {
              title: '用户管理',
              description: '管理系统用户信息',
              icon: 'user',
              showInMenu: true,
              // 用户管理需要所有参数
              injectParams: true,
              injectUserInfo: true,
              injectCallbacks: true
            }
          },
          {
            path: 'settings', // 相对于父路径的路径
            name: '系统设置',
            component: SystemSettings,
            meta: {
              title: '系统设置',
              description: '系统配置和参数设置',
              icon: 'setting',
              showInMenu: true,
              // 系统设置需要所有参数
              injectParams: true,
              injectUserInfo: true,
              injectCallbacks: true
            }
          },
          {
            path: 'logs', // 相对于父路径的路径
            name: '日志管理',
            component: LogManagement,
            meta: {
              title: '日志管理',
              description: '系统日志查看和管理',
              icon: 'file-text',
              showInMenu: true,
              // 日志管理需要用户信息
              injectParams: true,
              injectUserInfo: true,
              injectCallbacks: false
            }
          }
        ]
      },
      {
        path: 'content', // 为菜单组设置唯一路径
        name: '内容管理',
        component: null, // 父级路由不需要组件
        meta: {
          title: '内容管理',
          description: '内容相关功能管理',
          icon: 'file',
          showInMenu: true,
          isGroup: true, // 标记为菜单组
        },
        children: [
          {
            path: 'management', // 相对于父路径的路径
            name: '内容管理',
            component: ContentManagement,
            meta: {
              title: '内容管理',
              description: '管理系统内容信息',
              icon: 'file',
              showInMenu: true,
              // 内容管理需要用户信息但不一定需要回调
              injectParams: true,
              injectUserInfo: true,
              injectCallbacks: false
            }
          },
          {
            path: 'produceInfo', // 相对于父路径的路径
            name: '产品介绍',
            component: ProduceInfo,
            meta: {
              title: '产品介绍',
              description: '产品详细信息展示',
              icon: 'file',
              showInMenu: true,
              // 产品介绍页面相对简单，只需要基本参数
              injectParams: true,
              injectUserInfo: false,
              injectCallbacks: false
            }
          }
        ]
      },
      {
        path: 'analysis', // 为菜单组设置唯一路径
        name: '数据分析',
        component: null, // 父级路由不需要组件
        meta: {
          title: '数据分析',
          description: '数据分析和监控功能',
          icon: 'bar-chart',
          showInMenu: true,
          isGroup: true, // 标记为菜单组
        },
        children: [
          {
            path: 'data', // 相对于父路径的路径
            name: '数据分析',
            component: DataAnalysis,
            meta: {
              title: '数据分析',
              description: '系统数据统计和分析',
              icon: 'bar-chart',
              showInMenu: true,
              // 数据分析需要用户信息和回调函数
              injectParams: true,
              injectUserInfo: true,
              injectCallbacks: true
            }
          },
          {
            path: 'performance-demo', // 相对于父路径的路径
            name: '性能监控演示',
            component: PerformanceDemo,
            meta: {
              title: '性能监控演示',
              description: '性能监控工具演示页面',
              icon: 'monitor',
              showInMenu: true,
              // 演示页面需要基本参数
              injectParams: true,
              injectUserInfo: false,
              injectCallbacks: false
            }
          }
        ]
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
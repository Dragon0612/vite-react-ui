import { lazy } from 'react'
// 懒加载组件
const Layout = lazy(() => import('@/components/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/login'))
const UserManagement = lazy(() => import('@/pages/UserManagement'))
const SystemSettings = lazy(() => import('@/pages/systemSettings'))
const ContentManagement = lazy(() => import('@/pages/ContentManagement'))
const ProduceInfo = lazy(() => import('@/pages/produceInfo'))
const LogManagement = lazy(() => import('@/pages/LogManagement'))
const PerformanceDemo = lazy(() => import('@/pages/performanceTest/PerformanceDemo'))
const ApiDemo = lazy(() => import('@/pages/performanceTest/ApiDemo'))

const About = lazy(() => import('@/pages/About'))
const Help = lazy(() => import('@/pages/Help'))
const Contact = lazy(() => import('@/pages/Contact'))
const StateDemo = lazy(() => import('@/pages/performanceTest/StateDemo'))
const KeepAliveTest = lazy(() => import('@/pages/performanceTest/KeepAliveTest'))
const PermissionManagement = lazy(() => import('@/pages/permissionManagerment'))

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
          injectCallbacks: true,
          // KeepAlive 配置
          keepAlive: true,
          cacheKey: 'dashboard'
        }
      },
      {
        path: 'about',
        name: '关于我们',
        component: About,
        meta: {
          title: '关于我们',
          description: '关于页面信息',
          icon: 'info-circle',
          showInMenu: true,
          // 关于页面只需要基本参数
          injectParams: true,
          injectUserInfo: false,
          injectCallbacks: false
        }
      },
      {
        path: 'help',
        name: '帮助中心',
        component: Help,
        meta: {
          title: '帮助中心',
          description: '帮助页面信息',
          icon: 'question-circle',
          showInMenu: true,
          // 帮助页面只需要基本参数
          injectParams: true,
          injectUserInfo: false,
          injectCallbacks: false
        }
      },
      {
        path: 'contact',
        name: '联系我们',
        component: Contact,
        meta: {
          title: '联系我们',
          description: '联系页面信息',
          icon: 'phone',
          showInMenu: true,
          // 联系页面只需要基本参数
          injectParams: true,
          injectUserInfo: false,
          injectCallbacks: false
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
          injectCallbacks: true,
          // KeepAlive 配置
          keepAlive: true,
          cacheKey: 'user-management'
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
          injectCallbacks: true,
          // KeepAlive 配置
          keepAlive: true,
          cacheKey: 'system-settings'
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
          },
          {
            path: 'permissions', // 相对于父路径的路径
            name: '权限管理',
            component: PermissionManagement,
            meta: {
              title: '权限管理',
              description: '系统权限和角色管理',
              icon: 'safety',
              showInMenu: true,
              // 权限管理需要用户信息
              injectParams: true,
              injectUserInfo: true,
              injectCallbacks: true,
              // KeepAlive 配置
              keepAlive: true,
              cacheKey: 'permission-management'
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
        path: 'performance', // 为菜单组设置唯一路径
        name: '性能测试',
        component: null, // 父级路由不需要组件
        meta: {
          title: '性能测试',
          description: '性能测试和监控功能',
          icon: 'monitor',
          showInMenu: true,
          isGroup: true, // 标记为菜单组
        },
        children: [
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
          },
          {
            path: 'api-demo', // 相对于父路径的路径
            name: 'API架构演示',
            component: ApiDemo,
            meta: {
              title: 'API架构演示',
              description: '新API管理架构演示页面',
              icon: 'api',
              showInMenu: true,
              // 演示页面需要基本参数
              injectParams: true,
              injectUserInfo: false,
              injectCallbacks: false
            }
          },
          {
            path: 'state-demo', // 相对于父路径的路径
            name: '状态持久化演示',
            component: StateDemo,
            meta: {
              title: '状态持久化演示',
              description: 'Zustand状态持久化功能演示',
              icon: 'database',
              showInMenu: true,
              // 演示页面需要基本参数
              injectParams: true,
              injectUserInfo: false,
              injectCallbacks: false
            }
          },

          {
            path: 'keep-alive-test', // 相对于父路径的路径
            name: 'KeepAlive测试',
            component: KeepAliveTest,
            meta: {
              title: 'KeepAlive测试',
              description: 'KeepAlive功能测试页面',
              icon: 'experiment',
              showInMenu: true,
              // 演示页面需要基本参数
              injectParams: true,
              injectUserInfo: false,
              injectCallbacks: false,
              // KeepAlive 配置
              keepAlive: true,
              cacheKey: 'keep-alive-test'
            }
          },


        ]
      },
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
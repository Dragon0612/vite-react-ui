import { lazy } from 'react'

// 懒加载组件
const Layout = lazy(() => import('@/components/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const UserManagement = lazy(() => import('@/pages/UserManagement'))
const ProductManagement = lazy(() => import('@/pages/ProductManagement'))
const OrderManagement = lazy(() => import('@/pages/OrderManagement'))
const ContentManagement = lazy(() => import('@/pages/ContentManagement'))
const SystemSettings = lazy(() => import('@/pages/SystemSettings'))
const Analytics = lazy(() => import('@/pages/Analytics'))
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
      },
      {
        path: 'analytics',
        name: '数据分析',
        component: Analytics,
        meta: {
          title: '数据分析',
          icon: 'analytics',
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
        path: 'products',
        name: '商品管理',
        component: ProductManagement,
        meta: {
          title: '商品管理',
          icon: 'product',
          showInMenu: true
        }
      },
      {
        path: 'orders',
        name: '订单管理',
        component: OrderManagement,
        meta: {
          title: '订单管理',
          icon: 'order',
          showInMenu: true
        }
      },
      {
        path: 'content',
        name: '内容管理',
        component: ContentManagement,
        meta: {
          title: '内容管理',
          icon: 'content',
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
import { lazy } from 'react'

// 懒加载组件
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const AntdDemo = lazy(() => import('@/components/AntdDemo'))
const StyleDemo = lazy(() => import('@/components/StyleDemo'))
const RequestDemo = lazy(() => import('@/components/RequestDemo'))
const UserList = lazy(() => import('@/components/UserList'))
const Example = lazy(() => import('@/pages/Example'))

// 路由配置
export const routes = [
  {
    path: '/',
    name: '首页',
    component: Home,
    meta: {
      title: '首页',
      icon: 'home',
      showInMenu: true
    }
  },
  {
    path: '/about',
    name: '关于',
    component: About,
    meta: {
      title: '关于页面',
      icon: 'info',
      showInMenu: true
    }
  },
  {
    path: '/demo',
    name: 'Ant Design 演示',
    component: AntdDemo,
    meta: {
      title: 'Ant Design 演示',
      icon: 'ant-design',
      showInMenu: true
    }
  },
  {
    path: '/style-demo',
    name: '样式演示',
    component: StyleDemo,
    meta: {
      title: 'Less 样式演示',
      icon: 'style',
      showInMenu: true
    }
  },
  {
    path: '/request-demo',
    name: '请求演示',
    component: RequestDemo,
    meta: {
      title: '请求函数演示',
      icon: 'api',
      showInMenu: true
    }
  },
  {
    path: '/user-list',
    name: '用户管理',
    component: UserList,
    meta: {
      title: '用户管理',
      icon: 'user',
      showInMenu: true,
      requiresAuth: true
    }
  },
  {
    path: '/example',
    name: '路由示例',
    component: Example,
    meta: {
      title: '路由配置示例',
      icon: 'example',
      showInMenu: true,
      requiresAuth: false
    }
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
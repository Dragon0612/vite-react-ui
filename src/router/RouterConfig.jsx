import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import { routes } from './index'

// 加载中组件
const LoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <Spin size="large" />
  </div>
)

// 认证检查组件
const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('token')
  const location = window.location.pathname
  const isLoginPage = location === '/login'
  
  if (!token && !isLoginPage) {
    return <Navigate to="/login" replace />
  }
  
  if (token && isLoginPage) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// 页面组件包装器 - 自动注入必要的参数
const PageWrapper = ({ Component, routeMeta, ...props }) => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // 获取用户信息
  const userInfo = {
    id: localStorage.getItem('userId') || '1',
    username: localStorage.getItem('username') || 'admin',
    role: localStorage.getItem('userRole') || 'admin',
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]')
  }
  
  // 创建增强的props对象
  const enhancedProps = {
    // 路由相关参数
    params,
    location,
    navigate,
    
    // 页面配置参数
    title: routeMeta?.title || '',
    description: routeMeta?.description || '',
    loading: false,
    error: null,
    
    // 权限相关参数
    permissions: userInfo.permissions,
    userInfo,
    
    // 回调函数参数
    onRefresh: () => {
      console.log('页面刷新')
    },
    onError: (error) => {
      console.error('页面错误:', error)
    },
    
    // 扩展参数
    ...props
  }

  return <Component {...enhancedProps} />
}

// 递归渲染路由
const renderRoutes = (routes) => {
  return routes.map((route) => {
    if (route.children && route.children.length > 0) {
      return (
        <Route key={route.path} path={route.path} element={<route.component />}>
          {renderRoutes(route.children)}
        </Route>
      )
    } else {
      const element = route.meta?.requiresAuth !== false ? (
        <AuthGuard>
          <PageWrapper 
            Component={route.component} 
            routeMeta={route.meta}
          />
        </AuthGuard>
      ) : (
        <PageWrapper 
          Component={route.component} 
          routeMeta={route.meta}
        />
      )
      
      return (
        <Route
          key={route.path}
          path={route.path}
          element={element}
        />
      )
    }
  })
}

// 路由配置组件
function RouterConfig() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {renderRoutes(routes)}
        {/* 默认重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default RouterConfig 
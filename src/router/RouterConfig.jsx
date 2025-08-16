import React, { Suspense, useMemo, useCallback } from 'react'
import { Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import { routes } from './index'
import KeepAlive from '@/components/KeepAlive'
import { useUserInfo } from '@/providers/AppProvider'

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

// 优化的页面组件包装器
const PageWrapper = ({ Component, routeMeta, ...props }) => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const userInfo = useUserInfo()
  
  // 使用useCallback缓存回调函数
  const onRefresh = useCallback(() => {
    console.log('页面刷新')
  }, [])
  
  const onError = useCallback((error) => {
    console.error('页面错误:', error)
  }, [])
  
  // 根据路由meta信息决定是否注入特定参数
  const shouldInjectParams = routeMeta?.injectParams !== false
  const shouldInjectUserInfo = routeMeta?.injectUserInfo !== false
  const shouldInjectCallbacks = routeMeta?.injectCallbacks !== false
  
  // 使用useMemo缓存增强的props对象
  const enhancedProps = useMemo(() => {
    const baseProps = { ...props }
    
    // 条件注入路由参数
    if (shouldInjectParams) {
      baseProps.params = params
      baseProps.location = location
      baseProps.navigate = navigate
    }
    
    // 条件注入页面配置
    if (routeMeta?.title) baseProps.title = routeMeta.title
    if (routeMeta?.description) baseProps.description = routeMeta.description
    
    // 条件注入用户信息
    if (shouldInjectUserInfo) {
      baseProps.permissions = userInfo.permissions
      baseProps.userInfo = userInfo
    }
    
    // 条件注入回调函数
    if (shouldInjectCallbacks) {
      baseProps.onRefresh = onRefresh
      baseProps.onError = onError
    }
    
    // 默认值
    baseProps.loading = false
    baseProps.error = null
    
    return baseProps
  }, [
    shouldInjectParams,
    shouldInjectUserInfo,
    shouldInjectCallbacks,
    params,
    location,
    navigate,
    routeMeta?.title,
    routeMeta?.description,
    userInfo,
    onRefresh,
    onError,
    props
  ])

  // 判断是否需要 KeepAlive
  const needsKeepAlive = routeMeta?.keepAlive === true
  
  // 创建组件元素
  const componentElement = useMemo(() => (
    <Component {...enhancedProps} />
  ), [Component, enhancedProps])
  
  if (needsKeepAlive) {
    return (
      <KeepAlive
        include={[location.pathname]}
        exclude={['/login']}
        maxCache={10}
        scrollRestoration={true}
      >
        {componentElement}
      </KeepAlive>
    )
  }
  
  return componentElement
}

// 递归渲染路由
const renderRoutes = (routes) => {
  return routes.map((route) => {
    // 如果有子路由且有component，则渲染嵌套路由
    if (route.children && route.children.length > 0 && route.component) {
      return (
        <Route key={route.path} path={route.path} element={<route.component />}>
          {renderRoutes(route.children)}
        </Route>
      )
    }
    // 如果是菜单组（没有component但有children），则渲染父路由并包含子路由
    else if (route.children && route.children.length > 0 && !route.component) {
      return (
        <Route key={route.path} path={route.path}>
          {renderRoutes(route.children)}
        </Route>
      )
    }
    // 普通路由
    else {
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
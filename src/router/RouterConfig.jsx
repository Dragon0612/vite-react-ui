import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { routes, useAdminLayout } from './index'

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
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
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
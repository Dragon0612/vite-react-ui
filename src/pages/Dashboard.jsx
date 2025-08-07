import React from 'react'

function Dashboard({
  // 路由相关参数
  params,
  location,
  navigate,
  
  // 页面配置参数
  title,
  description,
  loading,
  error,
  
  // 权限相关参数
  permissions,
  userInfo,
  
  // 回调函数参数
  onRefresh,
  onError,
  
  // 扩展参数
  ...props
}) {
  return (
    <div>
      <h1>{title || '仪表盘'}</h1>
      <p>{description || '系统概览和统计数据'}</p>
      
      {/* 用户信息展示 */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h3>当前用户信息</h3>
        <p><strong>用户名:</strong> {userInfo?.username || '未知'}</p>
        <p><strong>角色:</strong> {userInfo?.role || '未知'}</p>
        <p><strong>权限:</strong> {permissions?.length || 0} 项</p>
      </div>
      
      {/* 路由信息展示 */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>路由信息</h3>
        <p><strong>当前路径:</strong> {location?.pathname}</p>
        <p><strong>路由参数:</strong> {JSON.stringify(params)}</p>
      </div>
      
      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3>调试信息：</h3>
          <p><strong>Props:</strong> {JSON.stringify({ title, description, loading, error })}</p>
          <p><strong>用户信息:</strong> {JSON.stringify(userInfo)}</p>
          <p><strong>权限:</strong> {JSON.stringify(permissions)}</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard 
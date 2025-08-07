import React, { useEffect } from 'react'
import { usePerformanceMonitor } from '@/utils/performance'

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
  const { 
    startRouteSwitch, 
    endRouteSwitch, 
    monitorComponentRender,
    getPerformanceReport,
    printPerformanceReport 
  } = usePerformanceMonitor()

  // 监控组件初始化性能
  useEffect(() => {
    // 开始监控路由切换
    startRouteSwitch()
    
    // 模拟路由切换完成
    setTimeout(() => {
      endRouteSwitch('/dashboard')
    }, 100)
  }, [startRouteSwitch, endRouteSwitch])

  // 手动触发性能监控
  const handlePerformanceCheck = () => {
    const report = getPerformanceReport()
    console.log('📈 当前性能报告:', report)
  }

  // 打印详细性能报告
  const handlePrintReport = () => {
    printPerformanceReport()
  }

  return (
    <div>
      <h1>{title || '仪表盘'}</h1>
      <p>{description || '系统概览和统计数据'}</p>
      
      {/* 性能监控控制面板 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e6f7ff', 
        borderRadius: '8px',
        border: '1px solid #91d5ff'
      }}>
        <h3>🔧 性能监控控制面板</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={handlePerformanceCheck}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            获取性能报告
          </button>
          <button 
            onClick={handlePrintReport}
            style={{
              padding: '8px 16px',
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            打印详细报告
          </button>
        </div>
      </div>
      
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
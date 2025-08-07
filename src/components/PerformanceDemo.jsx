import React, { useState } from 'react'
import { usePerformanceMonitor } from '@/utils/performance'

// 简单的性能监控演示组件
const PerformanceDemo = () => {
  const [results, setResults] = useState([])
  const { 
    startRouteSwitch, 
    endRouteSwitch, 
    monitorComponentRender,
    monitorPropsInjection,
    getPerformanceReport,
    printPerformanceReport 
  } = usePerformanceMonitor()

  // 模拟路由切换
  const handleRouteSwitch = () => {
    startRouteSwitch()
    setTimeout(() => {
      endRouteSwitch('/demo-route')
      setResults(prev => [...prev, '路由切换完成'])
    }, 200)
  }

  // 模拟组件渲染
  const handleComponentRender = () => {
    monitorComponentRender('DemoComponent', () => {
      // 模拟一些计算
      let sum = 0
      for (let i = 0; i < 1000000; i++) {
        sum += i
      }
      return sum
    })
    setResults(prev => [...prev, '组件渲染完成'])
  }

  // 模拟参数注入
  const handlePropsInjection = () => {
    monitorPropsInjection('DemoComponent', () => {
      // 模拟参数处理
      const props = {
        title: '测试标题',
        description: '测试描述',
        userInfo: { name: '测试用户', role: 'admin' },
        permissions: ['read', 'write', 'delete']
      }
      return props
    })
    setResults(prev => [...prev, '参数注入完成'])
  }

  // 获取性能报告
  const handleGetReport = () => {
    const report = getPerformanceReport()
    console.log('📊 性能报告:', report)
    setResults(prev => [...prev, '性能报告已生成，请查看控制台'])
  }

  // 打印详细报告
  const handlePrintReport = () => {
    printPerformanceReport()
    setResults(prev => [...prev, '详细报告已打印到控制台'])
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔧 性能监控演示</h1>
      <p>这是一个简单的性能监控工具演示，点击下面的按钮来测试各种性能监控功能。</p>
      
      {/* 控制按钮 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={handleRouteSwitch}
          style={{
            padding: '12px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🚀 模拟路由切换
        </button>
        
        <button 
          onClick={handleComponentRender}
          style={{
            padding: '12px 16px',
            backgroundColor: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ⚡ 模拟组件渲染
        </button>
        
        <button 
          onClick={handlePropsInjection}
          style={{
            padding: '12px 16px',
            backgroundColor: '#faad14',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔧 模拟参数注入
        </button>
        
        <button 
          onClick={handleGetReport}
          style={{
            padding: '12px 16px',
            backgroundColor: '#722ed1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📊 获取性能报告
        </button>
        
        <button 
          onClick={handlePrintReport}
          style={{
            padding: '12px 16px',
            backgroundColor: '#eb2f96',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📈 打印详细报告
        </button>
      </div>

      {/* 结果显示 */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f6ffed',
        border: '1px solid #b7eb8f',
        borderRadius: '6px'
      }}>
        <h3>📋 操作记录</h3>
        {results.length === 0 ? (
          <p style={{ color: '#666' }}>还没有执行任何操作</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {results.map((result, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{result}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 使用说明 */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '6px'
      }}>
        <h3>📖 使用说明</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>点击"模拟路由切换"来测试路由性能监控</li>
          <li>点击"模拟组件渲染"来测试组件渲染性能</li>
          <li>点击"模拟参数注入"来测试参数注入性能</li>
          <li>点击"获取性能报告"来查看当前性能数据</li>
          <li>点击"打印详细报告"来在控制台查看详细报告</li>
        </ol>
        <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '14px', color: '#666' }}>
          💡 提示：打开浏览器控制台可以看到实时的性能监控数据
        </p>
      </div>

      {/* 代码示例 */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #d9d9d9',
        borderRadius: '6px'
      }}>
        <h3>💻 代码示例</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
{`// 基本使用
import { usePerformanceMonitor } from '@/utils/performance'

const { monitorComponentRender, getPerformanceReport } = usePerformanceMonitor()

// 监控任何函数
const result = monitorComponentRender('MyFunction', () => {
  return expensiveOperation()
})

// 获取性能报告
const report = getPerformanceReport()
console.log(report)`}
        </pre>
      </div>
    </div>
  )
}

export default PerformanceDemo

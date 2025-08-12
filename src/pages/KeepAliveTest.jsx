import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Alert } from 'antd'
import { useLocation } from 'react-router-dom'

const { Title, Text } = Typography

const KeepAliveTest = () => {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const location = useLocation()
  
  // 模拟页面数据变化
  useEffect(() => {
    console.log('KeepAliveTest mounted, path:', location.pathname)
    return () => {
      console.log('KeepAliveTest unmounted, path:', location.pathname)
    }
  }, [location.pathname])

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>KeepAlive 简单测试</Title>
      
      <Alert
        message="测试说明"
        description="这是一个简单的 KeepAlive 测试页面。请进行一些操作后切换到其他页面，再回来看看状态是否被保持。"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Card title="状态测试" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>计数器: {count}</Text>
            <br />
            <Button onClick={() => setCount(prev => prev + 1)}>增加</Button>
            <Button onClick={() => setCount(0)}>重置</Button>
          </div>
          
          <div>
            <Text strong>输入框:</Text>
            <br />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入一些内容"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                marginTop: '8px'
              }}
            />
            <br />
            <Text type="secondary">已输入: {inputValue || '无'}</Text>
          </div>
          
          <div>
            <Text strong>当前路径: {location.pathname}</Text>
            <br />
            <Text type="secondary">组件挂载时间: {new Date().toLocaleTimeString()}</Text>
          </div>
        </Space>
      </Card>

      <Card title="测试步骤" size="small">
        <ol>
          <li>增加计数器到某个值</li>
          <li>在输入框中输入一些内容</li>
          <li>切换到其他页面（如仪表盘）</li>
          <li>再回到这个页面</li>
          <li>检查计数器和输入框的值是否被保持</li>
        </ol>
      </Card>
    </div>
  )
}

export default KeepAliveTest

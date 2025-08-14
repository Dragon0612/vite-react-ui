import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Divider, Alert, Tag, Row, Col, Badge } from 'antd'
import { ReloadOutlined, DatabaseOutlined, MonitorOutlined, InfoCircleOutlined, BugOutlined } from '@ant-design/icons'
import { useKeepAlive } from '@/hooks/useKeepAlive'

const { Title, Paragraph, Text } = Typography

/**
 * KeepAlive 功能演示页面
 * 展示 KeepAlive 的各种功能和用法
 */
const KeepAliveDemo = () => {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [timestamp, setTimestamp] = useState(Date.now())
  const [showDebug, setShowDebug] = useState(false)
  
  const {
    isCached,
    isActive,
    cachePage,
    removePage,
    clearCache,
    getCacheStats,
    currentPath
  } = useKeepAlive()

  // 模拟页面数据变化
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(Date.now())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // 获取缓存统计信息
  const stats = getCacheStats()

  // 测试 KeepAlive 功能
  const testKeepAlive = () => {
    // 手动缓存当前页面
    cachePage(currentPath, {
      title: 'KeepAlive 演示页面',
      timestamp: Date.now(),
      testData: { count, inputValue }
    })
  }

  // 测试页面状态保持
  const incrementCount = () => {
    setCount(prev => prev + 1)
  }

  const resetCount = () => {
    setCount(0)
  }

  // 获取 KeepAlive 调试信息
  const getKeepAliveDebugInfo = () => {
    if (window.__keepAlive) {
      return window.__keepAlive.getCacheInfo()
    }
    return null
  }

  const debugInfo = getKeepAliveDebugInfo()

  return (
    <div style={{ padding: '20px' }}>
      {/* 调试面板 */}
      {showDebug && (
        <Card 
          title={
            <Space>
              <BugOutlined />
              调试面板
            </Space>
          } 
          size="small" 
          style={{ 
            position: 'fixed', 
            top: '80px', 
            right: '20px', 
            width: '300px', 
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <Text strong>当前路径:</Text> <Text code>{currentPath}</Text>
            </div>
            <div>
              <Text strong>缓存状态:</Text> 
              <Badge 
                status={isCached() ? 'success' : 'default'} 
                text={isCached() ? '已缓存' : '未缓存'} 
              />
            </div>
            <div>
              <Text strong>活跃状态:</Text> 
              <Badge 
                status={isActive() ? 'processing' : 'default'} 
                text={isActive() ? '活跃' : '非活跃'} 
              />
            </div>
            {debugInfo && (
              <>
                <div>
                  <Text strong>总缓存:</Text> <Text code>{debugInfo.totalCached}</Text>
                </div>
                <div>
                  <Text strong>活跃页面:</Text> <Text code>{debugInfo.activePages}</Text>
                </div>
                <div>
                  <Text strong>缓存路径:</Text>
                  <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                    {debugInfo.cachedPaths.map(path => (
                      <Tag key={path} size="small" style={{ margin: '2px' }}>
                        {path}
                      </Tag>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Space>
        </Card>
      )}

      <Title level={2}>
        <DatabaseOutlined style={{ marginRight: '8px' }} />
        KeepAlive 功能演示
        <Button 
          type="text" 
          icon={<BugOutlined />} 
          onClick={() => setShowDebug(!showDebug)}
          style={{ marginLeft: '10px' }}
        >
          {showDebug ? '隐藏调试' : '显示调试'}
        </Button>
      </Title>
      
      <Alert
        message="KeepAlive 功能说明"
        description="这个页面演示了 KeepAlive 功能。当您切换到其他页面再回来时，页面的状态（计数器、输入框内容等）将被保持。"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* 当前状态显示 */}
      <Card title="当前页面状态" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ color: '#1890ff' }}>
                {isCached() ? '已缓存' : '未缓存'}
              </Title>
              <Text>缓存状态</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ color: '#52c41a' }}>
                {isActive() ? '活跃' : '非活跃'}
              </Title>
              <Text>活跃状态</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ color: '#faad14' }}>
                {currentPath}
              </Title>
              <Text>当前路径</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 功能测试区域 */}
      <Card title="功能测试区域" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 计数器测试 */}
          <div>
            <Title level={4}>计数器测试</Title>
            <Paragraph>
              这个计数器用于测试页面状态保持功能。当您切换到其他页面再回来时，计数器的值应该保持不变。
            </Paragraph>
            <Space>
              <Text strong>当前计数: {count}</Text>
              <Button onClick={incrementCount}>增加</Button>
              <Button onClick={resetCount}>重置</Button>
            </Space>
          </div>

          <Divider />

          {/* 输入框测试 */}
          <div>
            <Title level={4}>输入框测试</Title>
            <Paragraph>
              在下面的输入框中输入一些内容，然后切换到其他页面再回来，输入的内容应该被保持。
            </Paragraph>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入一些内容来测试状态保持"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              已输入: {inputValue || '无'}
            </Text>
          </div>

          <Divider />

          {/* 时间戳测试 */}
          <div>
            <Title level={4}>时间戳测试</Title>
            <Paragraph>
              这个时间戳每秒更新一次，用于验证页面是否真的被缓存了。
            </Paragraph>
            <Text code>最后更新时间: {new Date(timestamp).toLocaleString()}</Text>
          </div>
        </Space>
      </Card>

      {/* KeepAlive 控制面板 */}
      <Card title="KeepAlive 控制面板" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4}>手动控制</Title>
            <Space>
              <Button 
                type="primary" 
                icon={<DatabaseOutlined />}
                onClick={testKeepAlive}
              >
                手动缓存当前页面
              </Button>
              <Button 
                danger 
                icon={<ReloadOutlined />}
                onClick={() => removePage(currentPath)}
              >
                移除当前页面缓存
              </Button>
              <Button 
                danger 
                icon={<ReloadOutlined />}
                onClick={clearCache}
              >
                清空所有缓存
              </Button>
            </Space>
          </div>

          <div>
            <Title level={4}>缓存统计</Title>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#1890ff' }}>
                    {stats.totalCached}
                  </Title>
                  <Text>已缓存页面</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#52c41a' }}>
                    {stats.activePages}
                  </Title>
                  <Text>活跃页面</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#faad14' }}>
                    {stats.maxCache}
                  </Title>
                  <Text>最大缓存数</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#722ed1' }}>
                    {stats.cachedPaths.length}
                  </Title>
                  <Text>缓存路径数</Text>
                </div>
              </Col>
            </Row>
          </div>
        </Space>
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4}>如何测试 KeepAlive 功能</Title>
            <ol>
              <li>
                <Text strong>步骤 1:</Text> 在这个页面上进行一些操作（增加计数器、输入内容等）
              </li>
              <li>
                <Text strong>步骤 2:</Text> 点击左侧菜单，切换到其他页面（如仪表盘、用户管理等）
              </li>
              <li>
                <Text strong>步骤 3:</Text> 再次回到这个页面，检查之前的状态是否被保持
              </li>
              <li>
                <Text strong>步骤 4:</Text> 观察页面是否重新加载，还是直接显示之前的状态
              </li>
            </ol>
          </div>

          <div>
            <Title level={4}>预期效果</Title>
            <ul>
              <li>✅ 计数器值应该保持不变</li>
              <li>✅ 输入框内容应该被保持</li>
              <li>✅ 页面不应该重新加载</li>
              <li>✅ 滚动位置应该被恢复</li>
              <li>✅ 页面切换应该更加流畅</li>
            </ul>
          </div>

          <div>
            <Title level={4}>技术原理</Title>
            <Paragraph>
              KeepAlive 通过以下机制实现页面缓存：
            </Paragraph>
            <ul>
              <li>使用 React 的组件缓存机制</li>
              <li>结合 Redux 状态管理</li>
              <li>监听路由变化，智能管理缓存</li>
              <li>支持滚动位置恢复</li>
              <li>自动清理过期缓存</li>
            </ul>
          </div>
        </Space>
      </Card>

      {/* 调试信息 */}
      <Card title="调试信息" size="small">
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '12px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(stats, null, 2)}
        </pre>
      </Card>
    </div>
  )
}

export default KeepAliveDemo

import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Typography, Alert, Row, Col, Statistic, Progress, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
  HomeOutlined, 
  UserOutlined, 
  SettingOutlined, 
  ArrowLeftOutlined,
  ReloadOutlined 
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

/**
 * KeepAlive 测试页面
 * 用于测试页面缓存功能
 */
const KeepAliveTest = () => {
  const navigate = useNavigate()
  const [testData, setTestData] = useState({
    counter: 0,
    inputValue: '',
    timestamp: Date.now(),
    randomNumber: Math.floor(Math.random() * 1000),
    clicks: 0
  })
  
  const [pageLoads, setPageLoads] = useState(0)
  const [lastVisit, setLastVisit] = useState(null)
  const [keepAliveStatus, setKeepAliveStatus] = useState('检查中...')

  // 模拟页面加载
  useEffect(() => {
    setPageLoads(prev => prev + 1)
    setLastVisit(new Date().toLocaleString())
    
    // 模拟一些异步操作
    const timer = setTimeout(() => {
      console.log('KeepAliveTest: 页面加载完成')
    }, 100)

    // 检查 KeepAlive 状态
    const checkKeepAliveStatus = () => {
      if (window.__keepAlive) {
        const cacheInfo = window.__keepAlive.getCacheInfo()
        const isCached = cacheInfo.cachedPaths.includes('/performance/keep-alive-test')
        setKeepAliveStatus(isCached ? '已缓存' : '未缓存')
      } else {
        setKeepAliveStatus('未启用')
      }
    }

    // 延迟检查，确保 KeepAlive 组件已经初始化
    const statusTimer = setTimeout(checkKeepAliveStatus, 200)

    return () => {
      clearTimeout(timer)
      clearTimeout(statusTimer)
      console.log('KeepAliveTest: 页面卸载')
    }
  }, [])

  // 更新测试数据
  const updateTestData = (key, value) => {
    setTestData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 增加计数器
  const incrementCounter = () => {
    updateTestData('counter', testData.counter + 1)
    updateTestData('clicks', testData.clicks + 1)
    console.log('KeepAliveTest: 计数器增加，当前值:', testData.counter + 1)
  }

  // 重置数据
  const resetData = () => {
    setTestData({
      counter: 0,
      inputValue: '',
      timestamp: Date.now(),
      randomNumber: Math.floor(Math.random() * 1000),
      clicks: 0
    })
    console.log('KeepAliveTest: 数据已重置')
  }

  // 生成新的随机数
  const generateRandomNumber = () => {
    updateTestData('randomNumber', Math.floor(Math.random() * 1000))
    console.log('KeepAliveTest: 生成新随机数')
  }

  // 导航到其他页面
  const navigateToPage = (path) => {
    console.log('KeepAliveTest: 导航到页面:', path)
    navigate(path)
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
      <Title level={2}>
        <ReloadOutlined style={{ marginRight: '8px' }} />
        KeepAlive 功能测试
      </Title>

      <Alert
        message="测试说明"
        description="这个页面用于测试 KeepAlive 功能。请进行一些操作（增加计数器、输入内容等），然后切换到其他页面再回来，观察状态是否被保持。"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* KeepAlive 状态显示 */}
      <Card title="KeepAlive 状态" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="KeepAlive 状态" 
              value={keepAliveStatus} 
              prefix={<ReloadOutlined />}
              valueStyle={{ 
                color: keepAliveStatus === '已缓存' ? '#52c41a' : 
                       keepAliveStatus === '未缓存' ? '#faad14' : '#ff4d4f'
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="页面加载次数" 
              value={pageLoads} 
              prefix={<ReloadOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="最后访问时间" 
              value={lastVisit || '未知'} 
              prefix={<HomeOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="点击次数" 
              value={testData.clicks} 
              prefix={<UserOutlined />}
            />
          </Col>
        </Row>
        
        {/* 操作按钮 */}
        <div style={{ marginTop: '16px' }}>
          <Space>
            <Button 
              size="small" 
              onClick={() => {
                if (window.__keepAlive) {
                  window.__keepAlive.clearCache()
                  setKeepAliveStatus('未缓存')
                  console.log('手动清理了所有缓存')
                }
              }}
            >
              清理缓存
            </Button>
            <Button 
              size="small" 
              onClick={() => {
                setPageLoads(0)
                setTestData({
                  counter: 0,
                  inputValue: '',
                  timestamp: Date.now(),
                  randomNumber: Math.floor(Math.random() * 1000),
                  clicks: 0
                })
                console.log('重置了测试数据')
              }}
            >
              重置数据
            </Button>
          </Space>
        </div>
        
        {/* KeepAlive 调试信息 */}
        {debugInfo && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <Text strong>KeepAlive 调试信息:</Text>
            <div style={{ marginTop: '8px' }}>
              <Tag color="blue">总缓存: {debugInfo.totalCached}</Tag>
              <Tag color="green">活跃页面: {debugInfo.activePages}</Tag>
              <Tag color="orange">最大缓存: {debugInfo.maxCache}</Tag>
              <Tag color={debugInfo.isInitialized ? 'green' : 'red'}>
                已初始化: {debugInfo.isInitialized ? '是' : '否'}
              </Tag>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text strong>已缓存路径:</Text>
              <div style={{ marginTop: '4px' }}>
                {debugInfo.cachedPaths.map(path => (
                  <Tag key={path} size="small" style={{ margin: '2px' }}>
                    {path}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 状态测试 */}
      <Card title="状态测试" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 计数器测试 */}
          <div>
            <Title level={4}>计数器测试</Title>
            <Paragraph>
              当前计数: <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                {testData.counter}
              </Text>
            </Paragraph>
            <Paragraph type="secondary">
              这个计数器用于测试页面状态保持。如果 KeepAlive 正常工作，切换页面再回来时，计数器的值应该保持不变。
            </Paragraph>
            <Space>
              <Button type="primary" onClick={incrementCounter}>
                增加计数
              </Button>
              <Button onClick={resetData}>
                重置所有数据
              </Button>
            </Space>
          </div>

          {/* 输入框测试 */}
          <div>
            <Title level={4}>输入框测试</Title>
            <Paragraph>
              在下面的输入框中输入一些内容来测试状态保持：
            </Paragraph>
            <input
              type="text"
              value={testData.inputValue}
              onChange={(e) => updateTestData('inputValue', e.target.value)}
              placeholder="请输入一些内容..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
              已输入: {testData.inputValue || '无'}
            </Text>
          </div>

          {/* 随机数测试 */}
          <div>
            <Title level={4}>随机数测试</Title>
            <Paragraph>
              这个随机数用于验证页面是否重新加载。如果 KeepAlive 正常工作，切换页面再回来时，这个数字应该保持不变。
            </Paragraph>
            <Space>
              <Text code>当前随机数: {testData.randomNumber}</Text>
              <Button onClick={generateRandomNumber}>
                生成新随机数
              </Button>
            </Space>
          </div>

          {/* 时间戳测试 */}
          <div>
            <Title level={4}>时间戳测试</Title>
            <Paragraph>
              页面创建时间: <Text code>{new Date(testData.timestamp).toLocaleString()}</Text>
            </Paragraph>
            <Progress 
              percent={Math.min((Date.now() - testData.timestamp) / 1000, 100)} 
              format={() => `${Math.floor((Date.now() - testData.timestamp) / 1000)}秒`}
              status="active"
            />
          </div>
        </Space>
      </Card>

      {/* 导航测试 */}
      <Card title="导航测试" style={{ marginBottom: '20px' }}>
        <Paragraph>
          点击下面的按钮切换到其他页面，然后通过菜单或浏览器返回按钮回到这个页面，观察状态是否被保持：
        </Paragraph>
        <Space wrap>
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={() => navigateToPage('/')}
          >
            仪表盘
          </Button>
          <Button 
            icon={<UserOutlined />}
            onClick={() => navigateToPage('/system/users')}
          >
            用户管理
          </Button>
          <Button 
            icon={<SettingOutlined />}
            onClick={() => navigateToPage('/system/settings')}
          >
            系统设置
          </Button>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            返回上一页
          </Button>
        </Space>
      </Card>

      {/* 测试结果 */}
      <Card title="测试结果" size="small">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Text strong>KeepAlive 状态:</Text>
            <Text code style={{ marginLeft: '8px' }}>
              {window.__keepAlive ? '已启用' : '未启用'}
            </Text>
          </div>
          <div>
            <Text strong>缓存信息:</Text>
            <Text code style={{ marginLeft: '8px' }}>
              {window.__keepAlive ? JSON.stringify(window.__keepAlive.getCacheInfo(), null, 2) : '无'}
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default KeepAliveTest

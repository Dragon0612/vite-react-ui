import React, { useEffect, useRef } from 'react'
import { Card, Button, Space, Typography, Alert, Tag, Row, Col, Badge, Input, Statistic } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useKeepAliveTestStore } from '../../store/zustand/keepAliveTestStore'

const { Title, Text, Paragraph } = Typography

const KeepAliveTest = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pageLoadTimeRef = useRef(Date.now())
  
  // 直接使用 Zustand Store
  const {
    testData,
    pageLoads,
    lastVisit,
    keepAliveStatus,
    updateTestData,
    incrementCounter,
    resetData,
    setPageLoads,
    setLastVisit,
    setKeepAliveStatus,
    generateNewRandomNumber,
    resetAllData
  } = useKeepAliveTestStore()

  // 页面加载时更新状态
  useEffect(() => {
    const currentTime = Date.now()
    const newPageLoads = pageLoads + 1
    
    setPageLoads(newPageLoads)
    setLastVisit(currentTime)
    
    console.log(`🔄 KeepAliveTest 页面加载 #${newPageLoads}`, {
      当前时间: new Date(currentTime).toLocaleString(),
      页面加载次数: newPageLoads,
      KeepAlive状态: keepAliveStatus
    })
  }, [])

  // 处理输入变化
  const handleInputChange = (e) => {
    updateTestData('inputValue', e.target.value)
  }

  // 处理计数器增加
  const handleIncrement = () => {
    incrementCounter()
    console.log('➕ 计数器增加:', testData.counter + 1)
  }

  // 处理数据重置
  const handleReset = () => {
    resetData()
    console.log('🔄 数据已重置')
  }

  // 处理随机数生成
  const handleGenerateRandom = () => {
    generateNewRandomNumber()
    console.log('🎲 生成新随机数:', Math.floor(Math.random() * 1000))
  }

  // 处理缓存清理
  const handleClearCache = () => {
    if (window.__keepAlive) {
      window.__keepAlive.clearCache()
      setKeepAliveStatus('未缓存')
      console.log('🧹 手动清理了所有缓存')
    }
  }

  // 处理所有数据重置
  const handleResetAll = () => {
    resetAllData()
    console.log('🗑️ 重置了所有数据')
  }

  // 调试信息
  const debugInfo = window.__keepAlive ? window.__keepAlive.getCacheInfo() : null

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>KeepAlive 功能测试页面</Title>
      
      <Alert
        message="Zustand 状态管理已启用"
        description="此页面现在使用 Zustand 进行状态管理，状态会自动持久化到 localStorage。即使页面刷新或切换，数据也会保持。"
        type="success"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[24, 24]}>
        {/* 左侧：测试功能 */}
        <Col xs={24} lg={12}>
          <Card title="测试功能" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>计数器: </Text>
                <Badge count={testData.counter} showZero />
                <Button size="small" onClick={handleIncrement} style={{ marginLeft: '8px' }}>
                  新增计数
                </Button>
              </div>
              
              <div>
                <Text strong>输入内容: </Text>
                <Input
                  value={testData.inputValue}
                  onChange={handleInputChange}
                  placeholder="输入一些内容..."
                  style={{ marginTop: '8px' }}
                />
              </div>
              
              <div>
                <Text strong>随机数: </Text>
                <Tag color="blue">{testData.randomNumber}</Tag>
                <Button size="small" onClick={handleGenerateRandom} style={{ marginLeft: '8px' }}>
                  生成新随机数
                </Button>
              </div>
              
              <div>
                <Text strong>点击次数: </Text>
                <Tag color="green">{testData.clicks}</Tag>
              </div>
              
              <div>
                <Text strong>时间戳: </Text>
                <Text code>{new Date(testData.timestamp).toLocaleString()}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 右侧：状态信息 */}
        <Col xs={24} lg={12}>
          <Card title="状态信息" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic title="页面加载次数" value={pageLoads} />
              
              <div>
                <Text strong>最后访问: </Text>
                <Text code>
                  {lastVisit ? new Date(lastVisit).toLocaleString() : '未知'}
                </Text>
              </div>
              
              <div>
                <Text strong>KeepAlive 状态: </Text>
                <Tag color={keepAliveStatus === '已缓存' ? 'green' : 'red'}>
                  {keepAliveStatus}
                </Tag>
              </div>
              
              <div>
                <Text strong>数据摘要: </Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag color="blue">计数器: {testData.counter}</Tag>
                  <Tag color="green">点击: {testData.clicks}</Tag>
                  <Tag color="orange">随机数: {testData.randomNumber}</Tag>
                  <Tag color={testData.inputValue ? 'green' : 'red'}>
                    输入: {testData.inputValue ? '有' : '无'}
                  </Tag>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <Card title="操作控制" size="small" style={{ marginTop: '24px' }}>
        <Space wrap>
          <Button onClick={handleReset} type="primary">
            重置数据
          </Button>
          <Button onClick={handleResetAll} danger>
            重置所有数据
          </Button>
          <Button onClick={handleClearCache} type="default">
            清理缓存
          </Button>
        </Space>
      </Card>

      {/* KeepAlive 状态 */}
      <Card title="KeepAlive 状态" size="small" style={{ marginTop: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>当前状态: </Text>
            <Tag color={keepAliveStatus === '已缓存' ? 'green' : 'red'}>
              {keepAliveStatus}
            </Tag>
          </div>
          
          {debugInfo && (
            <div>
              <Text strong>调试信息: </Text>
              <div style={{ marginTop: '8px' }}>
                <Tag color="blue">总缓存: {debugInfo.totalCached}</Tag>
                <Tag color="green">活跃页面: {debugInfo.activePages}</Tag>
                <Tag color="orange">最大缓存: {debugInfo.maxCache}</Tag>
                <Tag color={debugInfo.isInitialized ? 'green' : 'red'}>
                  已初始化: {debugInfo.isInitialized ? '是' : '否'}
                </Tag>
              </div>
            </div>
          )}
          
          <div>
            <Text strong>页面性能: </Text>
            <div style={{ marginTop: '8px' }}>
              <Text>加载耗时: {Date.now() - pageLoadTimeRef.current}ms</Text>
            </div>
          </div>
        </Space>
      </Card>

      {/* 导航测试 */}
      <Card title="导航测试" size="small" style={{ marginTop: '24px' }}>
        <Space wrap>
          <Button onClick={() => navigate('/about')} type="default">
            跳转到 About 页面
          </Button>
          <Button onClick={() => navigate('/contact')} type="default">
            跳转到 Contact 页面
          </Button>
          <Button onClick={() => navigate('/dashboard')} type="default">
            跳转到 Dashboard 页面
          </Button>
          <Button onClick={() => navigate('/help')} type="default">
            跳转到 Help 页面
          </Button>
        </Space>
        
        <Paragraph style={{ marginTop: '16px' }}>
          <Text type="secondary">
            提示：跳转后返回此页面，观察状态是否保持。Zustand 会自动持久化状态到 localStorage，
            即使 KeepAlive 失效，数据也不会丢失。
          </Text>
        </Paragraph>
      </Card>

      {/* 性能监控 */}
      <Card title="性能监控" size="small" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="内存使用"
              value={performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A'}
              suffix="MB"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="页面加载时间"
              value={Date.now() - pageLoadTimeRef.current}
              suffix="ms"
            />
          </Col>
        </Row>
        
        <div style={{ marginTop: '16px' }}>
          <Text strong>Zustand 性能指标: </Text>
          <div style={{ marginTop: '8px' }}>
            <Tag color="blue">状态更新: 自动优化</Tag>
            <Tag color="green">持久化: 自动处理</Tag>
            <Tag color="orange">订阅: 高效更新</Tag>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default KeepAliveTest

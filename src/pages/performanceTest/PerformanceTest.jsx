import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Button, Alert, Table, Progress, Tag, Spin, Switch, Space } from 'antd'
import { 
  DashboardOutlined, 
  ThunderboltOutlined, 
  ClockCircleOutlined, 
  AreaChartOutlined,
  ReloadOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons'
import { getGlobalPerformanceMetrics, isPerformanceDataReady, resetPerformanceMonitoring, updateRealTimePerformanceMetrics } from '../../services/performanceMonitor'

function PerformanceTest() {
  const [globalMetrics, setGlobalMetrics] = useState(null)
  const [isDataReady, setIsDataReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRealTimeMode, setIsRealTimeMode] = useState(() => {
    // 从localStorage恢复实时监控状态
    const saved = localStorage.getItem('performance-realtime-mode')
    return saved ? JSON.parse(saved) : false
  })
  const [lastUpdateTime, setLastUpdateTime] = useState(null)

  useEffect(() => {
    // 初始化：检查全局性能数据是否已准备好
    const checkAndLoadData = () => {
      if (isPerformanceDataReady()) {
        const metrics = getGlobalPerformanceMetrics()
        setGlobalMetrics(metrics)
        setIsDataReady(true)
        setIsLoading(false)
        console.log('✅ 使用已收集的全局性能数据:', metrics)
      } else {
        console.log('⏳ 等待全局性能数据收集完成...')
      }
    }

    // 立即检查一次
    checkAndLoadData()

    // 监听全局性能数据准备完成事件
    const handlePerformanceReady = (event) => {
      console.log('🎉 收到全局性能数据准备完成事件', event.detail)
      if (event.detail && typeof event.detail === 'object') {
        setGlobalMetrics(event.detail)
        setIsDataReady(true)
        setIsLoading(false)
      } else {
        console.warn('⚠️ 收到的性能数据格式不正确:', event.detail)
      }
    }

    window.addEventListener('performance-metrics-ready', handlePerformanceReady)

    // 如果数据还没准备好，设置超时检查
    const timeout = setTimeout(() => {
      if (!isPerformanceDataReady()) {
        console.log('⚠️ 全局性能数据收集超时，使用当前可用数据')
        const metrics = getGlobalPerformanceMetrics()
        setGlobalMetrics(metrics)
        setIsDataReady(true)
        setIsLoading(false)
      }
    }, 5000)

    return () => {
      window.removeEventListener('performance-metrics-ready', handlePerformanceReady)
      clearTimeout(timeout)
    }
  }, [])

  // 实时监控效果
  useEffect(() => {
    let interval = null
    
    if (isRealTimeMode && isDataReady) {
      console.log('🔄 启动实时性能监控...')
      interval = setInterval(() => {
        const currentMetrics = updateRealTimePerformanceMetrics()
        if (currentMetrics) {
          setGlobalMetrics(currentMetrics)
          setLastUpdateTime(new Date())
        }
      }, 2000) // 每2秒更新一次
    }

    return () => {
      if (interval) {
        clearInterval(interval)
        console.log('⏹️ 停止实时监控')
      }
    }
  }, [isRealTimeMode, isDataReady])

  // 获取性能评级
  const getScoreLevel = (score) => {
    if (score >= 90) return { text: '优秀', color: 'success' }
    if (score >= 70) return { text: '良好', color: 'warning' }
    return { text: '需要改进', color: 'error' }
  }

  // 获取指标状态
  const getMetricStatus = (value, thresholds) => {
    if (value <= thresholds.good) return 'success'
    if (value <= thresholds.warning) return 'warning'
    return 'error'
  }

  // 手动刷新性能数据
  const refreshMetrics = () => {
    setIsLoading(true)
    setIsDataReady(false)
    setIsRealTimeMode(false) // 停止实时监控
    localStorage.setItem('performance-realtime-mode', JSON.stringify(false)) // 保存状态
    resetPerformanceMonitoring()
    
    // 等待新数据收集完成
    setTimeout(() => {
      const metrics = getGlobalPerformanceMetrics()
      setGlobalMetrics(metrics)
      setIsDataReady(isPerformanceDataReady())
      setIsLoading(false)
      setLastUpdateTime(new Date())
    }, 3000)
  }

  // 切换实时监控模式
  const toggleRealTimeMode = (checked) => {
    setIsRealTimeMode(checked)
    // 保存状态到localStorage
    localStorage.setItem('performance-realtime-mode', JSON.stringify(checked))
    if (checked) {
      setLastUpdateTime(new Date())
    }
  }

  // 立即获取最新数据
  const updateNow = () => {
    const currentMetrics = updateRealTimePerformanceMetrics()
    if (currentMetrics) {
      setGlobalMetrics(currentMetrics)
      setLastUpdateTime(new Date())
    }
  }

  // 清除缓存状态
  const clearCacheState = () => {
    localStorage.removeItem('performance-realtime-mode')
    setIsRealTimeMode(false)
    setLastUpdateTime(null)
  }

  // 导出性能报告
  const exportReport = () => {
    if (!globalMetrics) return
    
    const report = {
      timestamp: new Date().toISOString(),
      type: 'global-performance-report',
      ...globalMetrics,
      collectionInfo: {
        isGlobalData: true,
        collectedAt: globalMetrics.collectedAt,
        dataSource: 'Global Performance Monitor'
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `global-performance-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 如果正在加载或没有数据，显示加载状态
  if (isLoading || !globalMetrics || typeof globalMetrics !== 'object') {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <h3>正在收集全局性能数据...</h3>
          <p>这可能需要几秒钟的时间来完成首屏性能指标的收集</p>
          {globalMetrics && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              当前状态: {globalMetrics.isCollected ? '收集完成' : '收集中...'}
            </div>
          )}
        </div>
      </div>
    )
  }

  const { 
    fcp = 0, 
    lcp = 0, 
    fid = 0, 
    cls = 0, 
    ttfb = 0, 
    domLoad = 0, 
    windowLoad = 0, 
    totalTime = 0,
    currentTime = 0,
    memoryUsage = null,
    score: performanceScore = 0, 
    suggestions = [], 
    level: scoreLevel = { text: '未知', color: 'default' }
  } = globalMetrics || {}
  
  // 重建realTimeMetrics对象以保持兼容性
  const realTimeMetrics = {
    fcp, lcp, fid, cls, ttfb, domLoad, windowLoad, totalTime
  }

  // 性能指标表格数据
  const metricsTableData = [
    {
      key: 'fcp',
      metric: '首次内容绘制 (FCP)',
      value: Math.round(realTimeMetrics.fcp),
      unit: 'ms',
      status: getMetricStatus(realTimeMetrics.fcp, { good: 1000, warning: 1800 }),
      description: '页面开始渲染内容的时间'
    },
    {
      key: 'lcp',
      metric: '最大内容绘制 (LCP)',
      value: Math.round(realTimeMetrics.lcp),
      unit: 'ms',
      status: getMetricStatus(realTimeMetrics.lcp, { good: 2500, warning: 4000 }),
      description: '最大内容元素完成渲染的时间'
    },
    {
      key: 'fid',
      metric: '首次输入延迟 (FID)',
      value: Math.round(realTimeMetrics.fid),
      unit: 'ms',
      status: getMetricStatus(realTimeMetrics.fid, { good: 50, warning: 100 }),
      description: '用户首次交互到浏览器响应的时间'
    },
    {
      key: 'cls',
      metric: '累积布局偏移 (CLS)',
      value: realTimeMetrics.cls.toFixed(3),
      unit: '',
      status: getMetricStatus(realTimeMetrics.cls, { good: 0.05, warning: 0.1 }),
      description: '页面布局稳定性指标'
    },
    {
      key: 'ttfb',
      metric: '首字节时间 (TTFB)',
      value: Math.round(realTimeMetrics.ttfb),
      unit: 'ms',
      status: getMetricStatus(realTimeMetrics.ttfb, { good: 200, warning: 600 }),
      description: '服务器响应第一个字节的时间'
    },
    {
      key: 'totalTime',
      metric: '总加载时间',
      value: Math.round(realTimeMetrics.totalTime),
      unit: 'ms',
      status: getMetricStatus(realTimeMetrics.totalTime, { good: 2000, warning: 3000 }),
      description: '页面完全加载所需的总时间'
    }
  ]

  const columns = [
    {
      title: '性能指标',
      dataIndex: 'metric',
      key: 'metric',
      width: 180
    },
    {
      title: '数值',
      key: 'value',
      width: 100,
      render: (_, record) => (
        <span style={{ fontWeight: 'bold' }}>
          {record.value}{record.unit}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : status === 'warning' ? 'orange' : 'red'}>
          {status === 'success' ? '优秀' : status === 'warning' ? '良好' : '需要改进'}
        </Tag>
      )
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1><DashboardOutlined /> 性能测试监控</h1>
        <p>
          实时监控首屏加载性能和用户体验指标
          <Tag color="blue" style={{ marginLeft: '8px' }}>
            KeepAlive缓存
          </Tag>
        </p>
        
        {/* 全局数据提示 */}
        <Alert
          message={isRealTimeMode ? "实时性能监控" : "全局性能数据"}
          description={
            <div>
              📊 <strong>首屏性能指标</strong> (FCP、LCP、FID等): 应用启动时一次性收集，不会变化
              <br />
              🕒 数据收集时间: {globalMetrics.collectedAt ? new Date(globalMetrics.collectedAt).toLocaleString() : '未知'}
              {lastUpdateTime && (
                <>
                  <br />
                  🔄 最后更新时间: {lastUpdateTime.toLocaleTimeString()}
                </>
              )}
              {isRealTimeMode && (
                <>
                  <br />
                  🟢 <strong>动态指标</strong> (运行时间、内存使用): 每2秒实时更新
                </>
              )}
              <br />
              ✅ 这些指标反映了用户访问应用时的真实性能表现
            </div>
          }
          type={isRealTimeMode ? "success" : "info"}
          showIcon
          icon={isRealTimeMode ? <PlayCircleOutlined /> : <InfoCircleOutlined />}
          style={{ marginBottom: '16px' }}
        />
      </div>

      {/* 首屏性能指标 (静态) */}
      <Card title="🔵 首屏性能指标 (一次性收集，不会变化)" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="性能评分"
                value={performanceScore}
                suffix={`/ 100`}
                valueStyle={{ 
                  color: scoreLevel.color === 'success' ? '#3f8600' : 
                         scoreLevel.color === 'warning' ? '#cf1322' : '#cf1322' 
                }}
                prefix={<ThunderboltOutlined />}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                评级: <span style={{ fontWeight: 'bold' }}>{scoreLevel.text}</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="首次内容绘制 (FCP)"
                value={Math.round(realTimeMetrics.fcp)}
                suffix="ms"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ 
                  color: realTimeMetrics.fcp <= 1000 ? '#3f8600' : 
                         realTimeMetrics.fcp <= 1800 ? '#faad14' : '#cf1322'
                }}
              />
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#999' }}>
                静态指标
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="最大内容绘制 (LCP)"
                value={Math.round(realTimeMetrics.lcp)}
                suffix="ms"
                prefix={<AreaChartOutlined />}
                valueStyle={{ 
                  color: realTimeMetrics.lcp <= 2500 ? '#3f8600' : 
                         realTimeMetrics.lcp <= 4000 ? '#faad14' : '#cf1322'
                }}
              />
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#999' }}>
                静态指标
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="累积布局偏移 (CLS)"
                value={realTimeMetrics.cls.toFixed(3)}
                prefix={<DashboardOutlined />}
                valueStyle={{ 
                  color: realTimeMetrics.cls <= 0.05 ? '#3f8600' : 
                         realTimeMetrics.cls <= 0.1 ? '#faad14' : '#cf1322'
                }}
              />
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#999' }}>
                可累积指标
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 实时监控扩展指标 */}
      {isRealTimeMode && (
        <Card title="🟢 实时动态指标 (每2秒自动更新)" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="运行时间"
                  value={Math.round(currentTime / 1000)}
                  suffix="秒"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div style={{ marginTop: '4px', fontSize: '10px', color: '#1890ff' }}>
                  实时更新
                </div>
              </Card>
            </Col>
            {memoryUsage && (
              <>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="内存使用"
                      value={memoryUsage.used}
                      suffix={`/ ${memoryUsage.total} MB`}
                      prefix={<AreaChartOutlined />}
                      valueStyle={{ 
                        color: memoryUsage.used / memoryUsage.total > 0.8 ? '#cf1322' : 
                               memoryUsage.used / memoryUsage.total > 0.6 ? '#faad14' : '#3f8600'
                      }}
                    />
                    <div style={{ marginTop: '4px', fontSize: '10px', color: '#1890ff' }}>
                      实时更新
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="内存使用率"
                      value={((memoryUsage.used / memoryUsage.total) * 100).toFixed(1)}
                      suffix="%"
                      prefix={<DashboardOutlined />}
                      valueStyle={{ 
                        color: memoryUsage.used / memoryUsage.total > 0.8 ? '#cf1322' : 
                               memoryUsage.used / memoryUsage.total > 0.6 ? '#faad14' : '#3f8600'
                      }}
                    />
                    <div style={{ marginTop: '4px', fontSize: '10px', color: '#1890ff' }}>
                      实时更新
                    </div>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </Card>
      )}

      {/* 操作按钮 */}
      <Row style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Space size="middle" wrap>
            {/* 实时监控开关 */}
            <Card size="small" style={{ display: 'inline-block' }}>
              <Space align="center">
                <Switch
                  checked={isRealTimeMode}
                  onChange={toggleRealTimeMode}
                  checkedChildren={<PlayCircleOutlined />}
                  unCheckedChildren={<PauseCircleOutlined />}
                />
                <span style={{ fontWeight: 'bold' }}>
                  {isRealTimeMode ? '实时监控' : '静态显示'}
                </span>
              </Space>
            </Card>

            {/* 操作按钮 */}
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={refreshMetrics}
              disabled={isRealTimeMode}
              loading={isLoading}
            >
              重新收集数据
            </Button>
            
            <Button 
              icon={<ThunderboltOutlined />} 
              onClick={updateNow}
              disabled={isRealTimeMode}
            >
              立即更新
            </Button>
            
            <Button 
              icon={<DownloadOutlined />} 
              onClick={exportReport}
            >
              导出报告
            </Button>
            
            <Button 
              type="text" 
              size="small"
              onClick={clearCacheState}
              style={{ color: '#999' }}
            >
              清除缓存状态
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 优化建议 */}
      {suggestions.length > 0 && (
        <Card title="💡 性能优化建议" style={{ marginBottom: '24px' }}>
          {suggestions.map((suggestion, index) => (
            <Alert
              key={index}
              message={suggestion.message}
              type={suggestion.type}
              showIcon
              style={{ marginBottom: index < suggestions.length - 1 ? '8px' : 0 }}
            />
          ))}
        </Card>
      )}

      {/* 详细指标表格 */}
      <Card title="📊 详细性能指标">
        <Table
          columns={columns}
          dataSource={metricsTableData}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 性能标准说明 */}
      <Card title="📖 性能标准说明" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <h4>Core Web Vitals 标准:</h4>
            <ul>
              <li><strong>FCP (首次内容绘制)</strong>: &lt;1s 优秀, &lt;1.8s 良好</li>
              <li><strong>LCP (最大内容绘制)</strong>: &lt;2.5s 优秀, &lt;4s 良好</li>
              <li><strong>FID (首次输入延迟)</strong>: &lt;50ms 优秀, &lt;100ms 良好</li>
              <li><strong>CLS (累积布局偏移)</strong>: &lt;0.05 优秀, &lt;0.1 良好</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <h4>其他指标标准:</h4>
            <ul>
              <li><strong>TTFB (首字节时间)</strong>: &lt;200ms 优秀, &lt;600ms 良好</li>
              <li><strong>总加载时间</strong>: &lt;2s 优秀, &lt;3s 良好</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default PerformanceTest

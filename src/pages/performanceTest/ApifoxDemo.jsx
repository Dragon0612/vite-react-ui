import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Divider, 
  Tag, 
  Alert, 
  Descriptions, 
  Table, 
  message,
  Switch,
  Typography,
  Row,
  Col,
  Statistic,
  Badge,
  Timeline,
  Modal,
  Tabs
} from 'antd'
import { 
  ApiOutlined, 
  CloudOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  LinkOutlined,
  BugOutlined,
  ThunderboltOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { 
  apifoxUserService, 
  testApifoxIntegration,
  isApifoxEnabled,
  getApifoxProjectUrl,
  getApifoxMockUrl,
  APIFOX_PROJECT_INFO 
} from '@/services/api'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const ApifoxDemo = () => {
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
  const [mockEnabled, setMockEnabled] = useState(isApifoxEnabled())
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])

  // 项目信息
  const projectInfo = {
    id: APIFOX_PROJECT_INFO.id,
    name: APIFOX_PROJECT_INFO.name,
    url: getApifoxProjectUrl(),
    mockUrl: getApifoxMockUrl(),
    enabled: isApifoxEnabled()
  }

  useEffect(() => {
    // 页面加载时自动测试连接
    handleTestConnection()
  }, [])

  // 添加日志
  const addLog = (type, message) => {
    const log = {
      key: Date.now(),
      time: new Date().toLocaleTimeString(),
      type,
      message
    }
    setLogs(prev => [log, ...prev.slice(0, 9)]) // 只保留最近10条
  }

  // 测试 Apifox 连接
  const handleTestConnection = async () => {
    setLoading(true)
    addLog('info', '开始测试 Apifox 连接...')
    
    try {
      const result = await apifoxUserService.testApifoxConnection()
      setConnectionStatus(result)
      
      if (result.success) {
        addLog('success', 'Apifox Mock 连接成功!')
        message.success('Apifox Mock 连接成功!')
      } else {
        addLog('error', `Apifox Mock 连接失败: ${result.error}`)
        message.error('Apifox Mock 连接失败!')
      }
    } catch (error) {
      addLog('error', `连接测试异常: ${error.message}`)
      message.error('连接测试失败!')
    } finally {
      setLoading(false)
    }
  }

  // 运行完整集成测试
  const handleFullTest = async () => {
    setLoading(true)
    addLog('info', '开始完整 Apifox 集成测试...')
    
    try {
      const results = await testApifoxIntegration()
      setTestResults(results)
      addLog('success', '完整集成测试完成!')
      message.success('集成测试完成!')
    } catch (error) {
      addLog('error', `集成测试失败: ${error.message}`)
      message.error('集成测试失败!')
    } finally {
      setLoading(false)
    }
  }

  // API 对比测试
  const handleApiComparison = async () => {
    setLoading(true)
    addLog('info', '开始 API 响应对比测试...')
    
    try {
      const results = await apifoxUserService.compareApiResponses({ page: 1, pageSize: 5 })
      setComparisonResults(results)
      addLog('success', 'API 对比测试完成!')
      message.success('API 对比完成!')
    } catch (error) {
      addLog('error', `API 对比失败: ${error.message}`)
      message.error('API 对比失败!')
    } finally {
      setLoading(false)
    }
  }

  // 获取 Mock 用户数据
  const handleGetMockUsers = async () => {
    setLoading(true)
    addLog('info', '获取 Apifox Mock 用户数据...')
    
    try {
      const result = await apifoxUserService.getMockUsers({ page: 1, pageSize: 10 })
      setUsers(Array.isArray(result) ? result : result.data || [])
      addLog('success', `成功获取 ${users.length} 条 Mock 用户数据`)
      message.success('Mock 数据获取成功!')
    } catch (error) {
      addLog('error', `获取 Mock 数据失败: ${error.message}`)
      message.error('获取 Mock 数据失败!')
    } finally {
      setLoading(false)
    }
  }

  // 智能 API 调用
  const handleSmartApiCall = async () => {
    setLoading(true)
    addLog('info', '执行智能 API 调用...')
    
    try {
      const result = await apifoxUserService.getUsers({ page: 1, pageSize: 5 })
      setUsers(Array.isArray(result) ? result : result.data || [])
      addLog('success', '智能 API 调用成功!')
      message.success('智能 API 调用成功!')
    } catch (error) {
      addLog('error', `智能 API 调用失败: ${error.message}`)
      message.error('智能 API 调用失败!')
    } finally {
      setLoading(false)
    }
  }

  // 用户表格列定义
  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status || '未知'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString() : '未知'
    }
  ]

  // 日志表格列定义
  const logColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => {
        const colors = { success: 'green', error: 'red', info: 'blue' }
        return <Tag color={colors[type]}>{type}</Tag>
      }
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {/* 页面标题 */}
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <ApiOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={2}>Apifox 集成演示</Title>
              <Paragraph>
                本页面演示了与 <a href={projectInfo.url} target="_blank" rel="noopener noreferrer">
                  Apifox 项目 #{projectInfo.id}
                </a> 的集成功能，包括 Mock 数据服务、API 对比测试等。
              </Paragraph>
              <Space>
                <Badge status={projectInfo.enabled ? 'processing' : 'default'} />
                <Text>Mock 服务状态: {projectInfo.enabled ? '已启用' : '已禁用'}</Text>
              </Space>
            </div>
          </Card>
        </Col>

        {/* 项目信息 */}
        <Col span={24}>
          <Card title="🔗 Apifox 项目信息" extra={
            <Button 
              type="link" 
              icon={<LinkOutlined />}
              href={projectInfo.url}
              target="_blank"
            >
              访问项目
            </Button>
          }>
            <Descriptions column={2}>
              <Descriptions.Item label="项目 ID">{projectInfo.id}</Descriptions.Item>
              <Descriptions.Item label="项目名称">{projectInfo.name}</Descriptions.Item>
              <Descriptions.Item label="Mock URL">
                <Text copyable ellipsis style={{ maxWidth: '300px' }}>
                  {projectInfo.mockUrl}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="启用状态">
                <Switch 
                  checked={mockEnabled} 
                  onChange={setMockEnabled}
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 操作面板 */}
        <Col span={24}>
          <Card title="🎮 操作面板">
            <Space wrap>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                loading={loading}
                onClick={handleTestConnection}
              >
                测试连接
              </Button>
              <Button 
                icon={<ThunderboltOutlined />}
                loading={loading}
                onClick={handleFullTest}
              >
                完整测试
              </Button>
              <Button 
                icon={<BugOutlined />}
                loading={loading}
                onClick={handleApiComparison}
              >
                API 对比
              </Button>
              <Button 
                icon={<CloudOutlined />}
                loading={loading}
                onClick={handleGetMockUsers}
              >
                获取 Mock 数据
              </Button>
              <Button 
                icon={<SettingOutlined />}
                loading={loading}
                onClick={handleSmartApiCall}
              >
                智能 API 调用
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 状态统计 */}
        <Col span={24}>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="连接状态"
                  value={connectionStatus?.success ? '正常' : '异常'}
                  valueStyle={{ color: connectionStatus?.success ? '#3f8600' : '#cf1322' }}
                  prefix={connectionStatus?.success ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="用户数据"
                  value={users.length}
                  suffix="条"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="操作日志"
                  value={logs.length}
                  suffix="条"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Mock 服务"
                  value={mockEnabled ? '启用' : '禁用'}
                  valueStyle={{ color: mockEnabled ? '#3f8600' : '#8c8c8c' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 详细结果展示 */}
        <Col span={24}>
          <Card title="📊 详细结果">
            <Tabs defaultActiveKey="users">
              <TabPane tab="用户数据" key="users">
                <Table
                  columns={userColumns}
                  dataSource={users}
                  pagination={{ pageSize: 5 }}
                  size="small"
                  locale={{ emptyText: '暂无用户数据，请先获取 Mock 数据' }}
                />
              </TabPane>
              
              <TabPane tab="操作日志" key="logs">
                <Table
                  columns={logColumns}
                  dataSource={logs}
                  pagination={{ pageSize: 10 }}
                  size="small"
                  locale={{ emptyText: '暂无操作日志' }}
                />
              </TabPane>
              
              <TabPane tab="测试结果" key="results">
                {testResults ? (
                  <div>
                    <Alert 
                      message="集成测试完成" 
                      type="success" 
                      style={{ marginBottom: '16px' }}
                    />
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label="连接测试">
                        <Badge 
                          status={testResults.connection?.success ? 'success' : 'error'} 
                          text={testResults.connection?.success ? '成功' : '失败'} 
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="项目信息">
                        <Text>{testResults.project?.name || '未获取到'}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="API 对比">
                        <Text>{testResults.comparison?.recommendation || '未执行'}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : (
                  <Alert message="请先运行完整测试" type="info" />
                )}
              </TabPane>

              <TabPane tab="API 对比" key="comparison">
                {comparisonResults ? (
                  <div>
                    <Alert 
                      message={comparisonResults.comparison?.recommendation || '对比完成'} 
                      type={comparisonResults.comparison?.bothSuccessful ? 'success' : 'warning'}
                      style={{ marginBottom: '16px' }}
                    />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card title="真实 API" size="small">
                          <Badge 
                            status={comparisonResults.real?.success ? 'success' : 'error'} 
                            text={comparisonResults.real?.success ? '响应成功' : '响应失败'} 
                          />
                          {comparisonResults.real?.error && (
                            <div style={{ marginTop: '8px' }}>
                              <Text type="danger">{comparisonResults.real.error}</Text>
                            </div>
                          )}
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="Mock API" size="small">
                          <Badge 
                            status={comparisonResults.mock?.success ? 'success' : 'error'} 
                            text={comparisonResults.mock?.success ? '响应成功' : '响应失败'} 
                          />
                          {comparisonResults.mock?.error && (
                            <div style={{ marginTop: '8px' }}>
                              <Text type="danger">{comparisonResults.mock.error}</Text>
                            </div>
                          )}
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Alert message="请先运行 API 对比测试" type="info" />
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ApifoxDemo

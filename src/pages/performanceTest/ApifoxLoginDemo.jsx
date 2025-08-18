import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Alert,
  Typography,
  Row,
  Col,
  Divider,
  Table,
  Tag,
  message,
  Modal,
  Descriptions,
  Timeline,
  Badge,
  Tabs,
  Switch
} from 'antd'
import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
  ApiOutlined,
  BugOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { apifoxAuthService, testApifoxLogin } from '@/services/api/services/ApifoxAuthService'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const ApifoxLoginDemo = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loginResult, setLoginResult] = useState(null)
  const [authStatus, setAuthStatus] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [scenarioResults, setScenarioResults] = useState([])
  const [logs, setLogs] = useState([])
  const [endpointInfo, setEndpointInfo] = useState(null)

  useEffect(() => {
    // 初始化
    updateAuthStatus()
    loadEndpointInfo()
    
    // 监听认证事件
    const handleLogin = (event) => {
      updateAuthStatus()
      addLog('success', '用户登录成功')
    }
    
    const handleLogout = () => {
      updateAuthStatus()
      addLog('info', '用户已登出')
    }
    
    window.addEventListener('auth:login', handleLogin)
    window.addEventListener('auth:logout', handleLogout)
    
    return () => {
      window.removeEventListener('auth:login', handleLogin)
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [])

  // 加载接口信息
  const loadEndpointInfo = () => {
    const info = apifoxAuthService.getLoginEndpointInfo()
    setEndpointInfo(info)
  }

  // 更新认证状态
  const updateAuthStatus = () => {
    const status = apifoxAuthService.getAuthStatus()
    setAuthStatus(status)
  }

  // 添加日志
  const addLog = (type, message) => {
    const log = {
      key: Date.now(),
      time: new Date().toLocaleTimeString(),
      type,
      message
    }
    setLogs(prev => [log, ...prev.slice(0, 19)]) // 保留最近20条
  }

  // 处理登录
  const handleLogin = async (values) => {
    setLoading(true)
    addLog('info', `尝试登录用户: ${values.username}`)
    
    try {
      const result = await apifoxAuthService.loginWithApifox(values)
      setLoginResult(result)
      
      if (result.success) {
        addLog('success', '登录成功!')
        message.success('登录成功!')
        updateAuthStatus()
      } else {
        addLog('error', `登录失败: ${result.message}`)
        message.error(`登录失败: ${result.message}`)
      }
    } catch (error) {
      addLog('error', `登录异常: ${error.message}`)
      message.error('登录异常!')
    } finally {
      setLoading(false)
    }
  }

  // 处理登出
  const handleLogout = async () => {
    setLoading(true)
    addLog('info', '执行登出操作...')
    
    try {
      const result = await apifoxAuthService.logout()
      
      if (result.success) {
        addLog('success', '登出成功!')
        message.success('登出成功!')
        setLoginResult(null)
        form.resetFields()
      } else {
        addLog('error', `登出失败: ${result.message}`)
        message.error(`登出失败: ${result.message}`)
      }
    } catch (error) {
      addLog('error', `登出异常: ${error.message}`)
      message.error('登出异常!')
    } finally {
      setLoading(false)
    }
  }

  // 测试连接
  const handleTestConnection = async () => {
    setLoading(true)
    addLog('info', '测试 Apifox 登录接口连接...')
    
    try {
      const result = await apifoxAuthService.testLoginEndpoint()
      
      if (result.success) {
        addLog('success', '接口连接正常!')
        message.success('接口连接正常!')
      } else {
        addLog('error', `接口连接失败: ${result.message}`)
        message.error(`接口连接失败: ${result.message}`)
      }
    } catch (error) {
      addLog('error', `连接测试异常: ${error.message}`)
      message.error('连接测试异常!')
    } finally {
      setLoading(false)
    }
  }

  // 运行完整测试
  const handleFullTest = async () => {
    setLoading(true)
    addLog('info', '开始完整的登录功能测试...')
    
    try {
      const results = await testApifoxLogin()
      setTestResults(results)
      setScenarioResults(results.scenarios || [])
      
      addLog('success', '完整测试完成!')
      message.success('完整测试完成!')
    } catch (error) {
      addLog('error', `测试失败: ${error.message}`)
      message.error('测试失败!')
    } finally {
      setLoading(false)
    }
  }

  // 快速填入测试数据
  const fillTestData = (type = 'admin') => {
    const testData = {
      admin: { username: 'admin@example.com', password: 'admin123' },
      user: { username: 'user@example.com', password: 'user123' },
      test: { username: 'test@example.com', password: 'test123' }
    }
    
    form.setFieldsValue(testData[type])
    addLog('info', `填入${type}测试数据`)
  }

  // 场景测试表格列
  const scenarioColumns = [
    {
      title: '场景',
      dataIndex: 'scenario',
      key: 'scenario',
    },
    {
      title: '用户名',
      dataIndex: ['credentials', 'username'],
      key: 'username',
    },
    {
      title: '密码',
      dataIndex: ['credentials', 'password'],
      key: 'password',
      render: (password) => password ? '••••••' : '(空)'
    },
    {
      title: '结果',
      dataIndex: 'success',
      key: 'success',
      render: (success) => (
        <Tag color={success ? 'green' : 'red'}>
          {success ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time) => `${time}ms`
    }
  ]

  // 日志表格列
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
              <LoginOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={2}>Apifox 登录接口演示</Title>
              <Paragraph>
                演示如何调用 Apifox Mock 登录接口 (GET 请求): <br/>
                <Text code copyable>{endpointInfo?.url}</Text>
                <br/><br/>
                认证 Token: <Text code copyable>shpT2Zh4YXB4oeDJ44Q47</Text>
              </Paragraph>
            </div>
          </Card>
        </Col>

        {/* 登录状态 */}
        <Col span={24}>
          <Card title="👤 当前登录状态">
            {authStatus?.isAuthenticated ? (
              <Alert
                message="已登录"
                description={
                  <div>
                    <p>用户: {authStatus.user?.username || authStatus.user?.email || '未知'}</p>
                    <p>Token: {authStatus.token?.substring(0, 20)}...</p>
                  </div>
                }
                type="success"
                action={
                  <Button 
                    type="primary" 
                    danger 
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    loading={loading}
                  >
                    登出
                  </Button>
                }
              />
            ) : (
              <Alert
                message="未登录"
                description="请使用下方表单进行登录测试"
                type="info"
              />
            )}
          </Card>
        </Col>

        <Col span={12}>
          {/* 登录表单 */}
          <Card title="📝 登录测试" extra={
            <Space>
              <Button size="small" onClick={() => fillTestData('admin')}>管理员</Button>
              <Button size="small" onClick={() => fillTestData('user')}>普通用户</Button>
              <Button size="small" onClick={() => fillTestData('test')}>测试用户</Button>
            </Space>
          }>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              disabled={loading}
            >
              <Form.Item
                label="用户名/邮箱"
                name="username"
                rules={[{ required: true, message: '请输入用户名或邮箱' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="请输入用户名或邮箱"
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  icon={<LoginOutlined />}
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            {/* 登录结果 */}
            {loginResult && (
              <Alert
                message={loginResult.success ? '登录成功' : '登录失败'}
                description={loginResult.message || JSON.stringify(loginResult.data || loginResult.error, null, 2)}
                type={loginResult.success ? 'success' : 'error'}
                style={{ marginTop: '16px' }}
              />
            )}
          </Card>
        </Col>

        <Col span={12}>
          {/* 操作面板 */}
          <Card title="🎮 测试操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                icon={<CheckCircleOutlined />}
                block
                loading={loading}
                onClick={handleTestConnection}
              >
                测试接口连接
              </Button>
              
              <Button 
                icon={<ThunderboltOutlined />}
                block
                loading={loading}
                onClick={handleFullTest}
              >
                运行完整测试
              </Button>
              
              <Button 
                icon={<EyeOutlined />}
                block
                onClick={() => {
                  Modal.info({
                    title: '接口信息',
                    content: (
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="URL">{endpointInfo?.url}</Descriptions.Item>
                        <Descriptions.Item label="方法">
                          <Tag color="green">{endpointInfo?.method}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="认证Token">
                          <Text code copyable>shpT2Zh4YXB4oeDJ44Q47</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="超时时间">{endpointInfo?.timeout}ms</Descriptions.Item>
                      </Descriptions>
                    ),
                    width: 600
                  })
                }}
              >
                查看接口信息
              </Button>
            </Space>
          </Card>

          {/* 测试结果统计 */}
          <Card title="📊 测试统计" style={{ marginTop: '16px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {scenarioResults.length}
                  </div>
                  <div>测试场景</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {scenarioResults.filter(r => r.success).length}
                  </div>
                  <div>成功场景</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 详细结果 */}
        <Col span={24}>
          <Card title="📋 详细结果">
            <Tabs defaultActiveKey="logs">
              <TabPane tab="操作日志" key="logs">
                <Table
                  columns={logColumns}
                  dataSource={logs}
                  pagination={{ pageSize: 10 }}
                  size="small"
                  locale={{ emptyText: '暂无操作日志' }}
                />
              </TabPane>
              
              <TabPane tab="场景测试" key="scenarios">
                <Table
                  columns={scenarioColumns}
                  dataSource={scenarioResults}
                  pagination={false}
                  size="small"
                  locale={{ emptyText: '请先运行完整测试' }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ApifoxLoginDemo

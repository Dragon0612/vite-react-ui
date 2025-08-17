import React, { useState, useEffect } from 'react'
import { Button, Card, Table, Form, Input, Select, Space, message, Tag, Statistic, Row, Col } from 'antd'
import { 
  userService, 
  authService, 
  httpClient,
  API_ENDPOINTS,
  RESPONSE_CODES
} from '../../services/api'

const { Option } = Select

/**
 * API架构演示组件
 * 展示新API架构的各种功能
 */
const ApiDemo = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [userForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [stats, setStats] = useState({})
  const [apiMetrics, setApiMetrics] = useState({})
  const [config, setConfig] = useState({})

  useEffect(() => {
    // 获取配置信息
    setConfig({
      baseURL: '/api',
      timeout: import.meta.env.DEV ? 10000 : 5000,
      environment: import.meta.env.MODE
    })
    
    // 获取用户列表
    fetchUsers()
    
    // 获取用户统计
    fetchUserStats()
    
    // 获取API性能指标
    fetchApiMetrics()
  }, [])

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    setLoading(true)
    try {
      const response = await userService.getUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params
      })
      
      setUsers(response.list || [])
      setPagination(prev => ({
        ...prev,
        total: response.total || 0
      }))
    } catch (error) {
      message.error('获取用户列表失败')
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取用户统计
  const fetchUserStats = async () => {
    try {
      const response = await userService.getUserStats()
      setStats(response)
    } catch (error) {
      console.error('获取用户统计失败:', error)
    }
  }

  // 获取API性能指标
  const fetchApiMetrics = () => {
    const service = httpClient.getService('user')
    if (service && service.getMetrics) {
      setApiMetrics(service.getMetrics())
    }
  }

  // 搜索用户
  const handleSearch = (values) => {
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchUsers(values)
  }

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields()
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchUsers()
  }

  // 分页变化
  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }))
    fetchUsers()
  }

  // 创建用户
  const handleCreateUser = async (values) => {
    try {
      await userService.createUser(values)
      message.success('用户创建成功')
      userForm.resetFields()
      fetchUsers()
      fetchUserStats()
    } catch (error) {
      message.error('用户创建失败')
      console.error('创建用户失败:', error)
    }
  }

  // 删除用户
  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId)
      message.success('用户删除成功')
      fetchUsers()
      fetchUserStats()
    } catch (error) {
      message.error('用户删除失败')
      console.error('删除用户失败:', error)
    }
  }

  // 测试认证服务
  const testAuthService = async () => {
    try {
      // 模拟登录
      const loginResult = await authService.login({
        username: 'demo',
        password: '123456'
      })
      
      if (loginResult.success) {
        message.success('登录成功')
        console.log('登录结果:', loginResult)
      } else {
        message.error('登录失败')
      }
    } catch (error) {
      message.error('认证服务测试失败')
      console.error('认证服务测试失败:', error)
    }
  }

  // 测试自定义服务
  const testCustomService = async () => {
    try {
      const customUserService = httpClient.createService('https://jsonplaceholder.typicode.com')
      const response = await customUserService.get('/users/1')
      message.success('自定义服务测试成功')
      console.log('自定义服务响应:', response)
    } catch (error) {
      message.error('自定义服务测试失败')
      console.error('自定义服务测试失败:', error)
    }
  }

  // 测试缓存功能
  const testCache = async () => {
    try {
      const startTime = Date.now()
      const response1 = await userService.get('/users', { cache: true })
      const time1 = Date.now() - startTime
      
      const startTime2 = Date.now()
      const response2 = await userService.get('/users', { cache: true })
      const time2 = Date.now() - startTime2
      
      message.success(`缓存测试完成: 首次${time1}ms, 缓存${time2}ms`)
      
      // 清除缓存
      if (userService.clearCache) {
        userService.clearCache()
        message.info('缓存已清除')
      }
    } catch (error) {
      message.error('缓存测试失败')
      console.error('缓存测试失败:', error)
    }
  }

  // 测试请求取消
  const testCancelRequest = async () => {
    try {
      const cancelToken = `cancel_${Date.now()}`
      
      // 发起请求
      const requestPromise = userService.get('/users', { cancelToken })
      
      // 延迟后取消请求
      setTimeout(() => {
        if (userService.cancelRequest) {
          userService.cancelRequest(cancelToken)
          message.info('请求已取消')
        }
      }, 100)
      
      await requestPromise
    } catch (error) {
      if (error.message.includes('cancel')) {
        message.info('请求被成功取消')
      } else {
        message.error('请求取消测试失败')
        console.error('请求取消测试失败:', error)
      }
    }
  }

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => handleDeleteUser(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <h1>API架构演示</h1>
      
      {/* 环境信息 */}
      <Card title="环境配置" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="当前环境" value={config.environment} />
          </Col>
          <Col span={6}>
            <Statistic title="API地址" value={config.baseURL} />
          </Col>
          <Col span={6}>
            <Statistic title="超时时间" value={`${config.timeout}ms`} />
          </Col>
          <Col span={6}>
            <Statistic title="重试次数" value={config.retryTimes} />
          </Col>
        </Row>
      </Card>

      {/* API性能指标 */}
      <Card title="API性能指标" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="总请求数" value={apiMetrics.totalRequests || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="成功请求" value={apiMetrics.successfulRequests || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="失败请求" value={apiMetrics.failedRequests || 0} />
          </Col>
          <Col span={6}>
            <Statistic 
              title="平均响应时间" 
              value={apiMetrics.averageResponseTime || 0} 
              suffix="ms" 
            />
          </Col>
        </Row>
      </Card>

      {/* 用户统计 */}
      <Card title="用户统计" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="总用户数" value={stats.totalUsers || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="活跃用户" value={stats.activeUsers || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="今日新增" value={stats.todayNewUsers || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="在线用户" value={stats.onlineUsers || 0} />
          </Col>
        </Row>
      </Card>

      {/* 功能测试 */}
      <Card title="功能测试" style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button onClick={testAuthService} type="primary">
            测试认证服务
          </Button>
          <Button onClick={testCustomService}>
            测试自定义服务
          </Button>
          <Button onClick={testCache}>
            测试缓存功能
          </Button>
          <Button onClick={testCancelRequest}>
            测试请求取消
          </Button>
          <Button onClick={fetchApiMetrics}>
            刷新性能指标
          </Button>
        </Space>
      </Card>

      {/* 创建用户 */}
      <Card title="创建用户" style={{ marginBottom: '24px' }}>
        <Form
          form={userForm}
          layout="inline"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="status"
            initialValue="active"
          >
            <Select style={{ width: 120 }}>
              <Option value="active">活跃</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建用户
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 搜索用户 */}
      <Card title="搜索用户" style={{ marginBottom: '24px' }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="keyword">
            <Input placeholder="搜索关键词" />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="用户状态" allowClear style={{ width: 120 }}>
              <Option value="active">活跃</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 用户列表 */}
      <Card title="用户列表">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  )
}

export default ApiDemo


import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Select, 
  Space, 
  Tag, 
  message, 
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Avatar,
  Tooltip
} from 'antd'
import { 
  UserOutlined, 
  TeamOutlined, 
  LockOutlined,
  SearchOutlined,
  SettingOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { usePermissionStore } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'
import PermissionButton from './PermissionButton'

const { Title, Text } = Typography
const { Option } = Select
const { Search } = Input

const UserPermissionAssignment = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  
  const { roles, getUserPermissions } = usePermissionStore()
  const { userInfo } = useUserStore()

  // 模拟用户数据
  const [users, setUsers] = useState([
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15 10:30:00',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      username: 'manager1',
      email: 'manager1@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-14 15:20:00',
      createdAt: '2024-01-02'
    },
    {
      id: '3',
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-13 09:15:00',
      createdAt: '2024-01-03'
    },
    {
      id: '4',
      username: 'guest1',
      email: 'guest1@example.com',
      role: 'guest',
      status: 'inactive',
      lastLogin: '2024-01-10 14:45:00',
      createdAt: '2024-01-04'
    }
  ])

  // 获取角色名称
  const getRoleName = (roleCode) => {
    const role = roles.find(r => r.code === roleCode)
    return role?.name || roleCode
  }

  // 获取角色颜色
  const getRoleColor = (roleCode) => {
    switch (roleCode) {
      case 'super_admin':
        return 'red'
      case 'admin':
        return 'orange'
      case 'manager':
        return 'blue'
      case 'user':
        return 'green'
      case 'guest':
        return 'default'
      default:
        return 'default'
    }
  }

  // 获取状态颜色
  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red'
  }

  // 获取状态文本
  const getStatusText = (status) => {
    return status === 'active' ? '活跃' : '禁用'
  }

  // 表格列定义
  const columns = [
    {
      title: '用户信息',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: '当前角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleName(role)}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <PermissionButton
            permission="user:manage"
            buttonProps={{
              type: 'link',
              icon: <EyeOutlined />,
              size: 'small'
            }}
            onClick={() => handleViewPermissions(record)}
          >
            查看权限
          </PermissionButton>
          
          <PermissionButton
            permission="user:manage"
            buttonProps={{
              type: 'link',
              icon: <SettingOutlined />,
              size: 'small'
            }}
            onClick={() => handleAssignRole(record)}
          >
            分配角色
          </PermissionButton>
        </Space>
      )
    }
  ]

  // 处理角色分配
  const handleAssignRole = (user) => {
    setSelectedUser(user)
    form.setFieldsValue({ role: user.role })
    setIsModalVisible(true)
  }

  // 处理查看权限
  const handleViewPermissions = (user) => {
    const userRole = roles.find(r => r.code === user.role)
    const permissions = userRole?.permissions || []
    
    Modal.info({
      title: `${user.username} 的权限信息`,
      width: 600,
      content: (
        <div>
          <p><strong>当前角色：</strong> {getRoleName(user.role)}</p>
          <p><strong>权限数量：</strong> {permissions.length} 个</p>
          <div style={{ marginTop: '16px' }}>
            <Text strong>权限列表：</Text>
            <div style={{ marginTop: '8px' }}>
              {permissions.map((permission, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                  {permission}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      )
    })
  }

  // 处理角色分配提交
  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // 更新用户角色
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: values.role }
            : user
        )
      )
      
      message.success('角色分配成功')
      setIsModalVisible(false)
      form.resetFields()
      setSelectedUser(null)
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 重置表单
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setSelectedUser(null)
  }

  // 过滤用户
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    getRoleName(user.role).toLowerCase().includes(searchText.toLowerCase())
  )

  // 统计信息
  const getStatistics = () => {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const inactiveUsers = users.filter(u => u.status === 'inactive').length
    
    const roleStats = {}
    users.forEach(user => {
      roleStats[user.role] = (roleStats[user.role] || 0) + 1
    })

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      roleStats
    }
  }

  const stats = getStatistics()

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>用户权限分配</Title>
          <Search
            placeholder="搜索用户名、邮箱或角色"
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* 统计信息 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Statistic
              title="总用户数"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活跃用户"
              value={stats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="禁用用户"
              value={stats.inactive}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="角色类型"
              value={Object.keys(stats.roleStats).length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 角色分配模态框 */}
      <Modal
        title={`分配角色 - ${selectedUser?.username}`}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="role"
            label="选择角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {roles.map(role => (
                <Option key={role.code} value={role.code}>
                  <Space>
                    <Tag color={getRoleColor(role.code)}>{role.name}</Tag>
                    <Text type="secondary">({role.permissions?.length || 0} 个权限)</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedUser && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
              <Text strong>当前用户信息：</Text>
              <div style={{ marginTop: '8px' }}>
                <div>用户名：{selectedUser.username}</div>
                <div>邮箱：{selectedUser.email}</div>
                <div>当前角色：<Tag color={getRoleColor(selectedUser.role)}>{getRoleName(selectedUser.role)}</Tag></div>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default UserPermissionAssignment

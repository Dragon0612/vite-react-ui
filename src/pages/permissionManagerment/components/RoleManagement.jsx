import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Tag, 
  message, 
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Transfer,
  Tooltip,
  Popconfirm
} from 'antd'
import { 
  TeamOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SettingOutlined,
  LockOutlined
} from '@ant-design/icons'
import { usePermissionStore, DEFAULT_ROLES } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'
import PermissionButton from './PermissionButton'

const { Title, Text } = Typography
const { TextArea } = Input

const RoleManagement = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [permissionLoading, setPermissionLoading] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  
  const { 
    roles, 
    permissions, 
    addRole, 
    updateRole, 
    deleteRole, 
    updateRolePermissions 
  } = usePermissionStore()
  
  const { userInfo } = useUserStore()



  // 获取角色颜色
  const getRoleColor = (roleCode) => {
    switch (roleCode) {
      case DEFAULT_ROLES.SUPER_ADMIN:
        return 'red'
      case DEFAULT_ROLES.ADMIN:
        return 'orange'
      case DEFAULT_ROLES.MANAGER:
        return 'blue'
      case DEFAULT_ROLES.USER:
        return 'green'
      case DEFAULT_ROLES.GUEST:
        return 'default'
      default:
        return 'default'
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <TeamOutlined style={{ color: getRoleColor(record.code) }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.code}</div>
          </div>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Tag color="blue">{permissions?.length || 0} 个</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault) => (
        <Tag color={isDefault ? 'green' : 'orange'}>
          {isDefault ? '系统默认' : '自定义'}
        </Tag>
      )
    },
    {
      title: '创建时间',
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
            permission="role:manage"
            buttonProps={{
              type: 'link',
              icon: <SettingOutlined />,
              size: 'small'
            }}
            onClick={() => handleAssignPermissions(record)}
          >
            分配权限
          </PermissionButton>
          
          {!record.isDefault && (
            <>
              <PermissionButton
                permission="role:manage"
                buttonProps={{
                  type: 'link',
                  icon: <EditOutlined />,
                  size: 'small'
                }}
                onClick={() => handleEdit(record)}
              >
                编辑
              </PermissionButton>
              
              <Popconfirm
                title="确定要删除这个角色吗？"
                description="删除后无法恢复，请谨慎操作。"
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <PermissionButton
                  permission="role:manage"
                  buttonProps={{
                    type: 'link',
                    danger: true,
                    icon: <DeleteOutlined />,
                    size: 'small'
                  }}
                >
                  删除
                </PermissionButton>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ]

  // 处理添加角色
  const handleAdd = () => {
    setSelectedRole(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 处理编辑角色
  const handleEdit = (role) => {
    setSelectedRole(role)
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description
    })
    setIsModalVisible(true)
  }

  // 处理删除角色
  const handleDelete = async (roleId) => {
    try {
      deleteRole(roleId)
      message.success('角色删除成功')
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }

  // 处理分配权限
  const handleAssignPermissions = (role) => {
    setSelectedRole(role)
    setSelectedPermissions(role.permissions || [])
    setIsPermissionModalVisible(true)
  }

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedRole) {
        // 编辑角色
        updateRole(selectedRole.id, values)
        message.success('角色更新成功')
      } else {
        // 添加角色
        addRole({
          ...values,
          permissions: [],
          isDefault: false
        })
        message.success('角色创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
      setSelectedRole(null)
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理权限分配提交
  const handlePermissionSubmit = async () => {
    setPermissionLoading(true)
    try {
      updateRolePermissions(selectedRole.id, selectedPermissions)
      message.success('权限分配成功')
      setIsPermissionModalVisible(false)
      setSelectedRole(null)
      setSelectedPermissions([])
    } catch (error) {
      message.error('权限分配失败，请重试')
    } finally {
      setPermissionLoading(false)
    }
  }

  // 重置表单
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setSelectedRole(null)
  }

  // 重置权限分配
  const handlePermissionCancel = () => {
    setIsPermissionModalVisible(false)
    setSelectedRole(null)
    setSelectedPermissions([])
  }

  // 权限转移框数据源
  const permissionDataSource = permissions.map(permission => ({
    key: permission.code,
    title: permission.name,
    description: permission.description,
    type: permission.type
  }))

  // 统计信息
  const getStatistics = () => {
    const totalRoles = roles.length
    const defaultRoles = roles.filter(r => r.isDefault).length
    const customRoles = roles.filter(r => !r.isDefault).length
    const totalPermissions = permissions.length

    return {
      total: totalRoles,
      default: defaultRoles,
      custom: customRoles,
      permissions: totalPermissions
    }
  }

  const stats = getStatistics()

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>角色管理</Title>
          <PermissionButton
            permission="role:manage"
            buttonProps={{
              type: 'primary',
              icon: <PlusOutlined />
            }}
            onClick={handleAdd}
          >
            添加角色
          </PermissionButton>
        </div>

        {/* 统计信息 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Statistic
              title="角色总数"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="系统默认角色"
              value={stats.default}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="自定义角色"
              value={stats.custom}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="可用权限"
              value={stats.permissions}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 角色表单模态框 */}
      <Modal
        title={selectedRole ? '编辑角色' : '添加角色'}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色代码"
            rules={[
              { required: true, message: '请输入角色代码' },
              { pattern: /^[a-z_]+$/, message: '角色代码只能包含小写字母和下划线' }
            ]}
          >
            <Input placeholder="请输入角色代码，如：editor" />
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <TextArea 
              placeholder="请输入角色描述" 
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配模态框 */}
      <Modal
        title={`分配权限 - ${selectedRole?.name}`}
        open={isPermissionModalVisible}
        onOk={handlePermissionSubmit}
        onCancel={handlePermissionCancel}
        confirmLoading={permissionLoading}
        width={800}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary">
            为角色 "{selectedRole?.name}" 分配权限。左侧为可用权限，右侧为已分配权限。
          </Text>
        </div>
        
        <Transfer
          dataSource={permissionDataSource}
          titles={['可用权限', '已分配权限']}
          targetKeys={selectedPermissions}
          onChange={setSelectedPermissions}
          render={item => (
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>{item.description}</div>
              <Tag size="small" color="blue">{item.type}</Tag>
            </div>
          )}
          showSearch
          filterOption={(inputValue, item) =>
            item.title.indexOf(inputValue) !== -1 ||
            item.description.indexOf(inputValue) !== -1
          }
          style={{ height: 400 }}
        />
      </Modal>
    </div>
  )
}

export default RoleManagement

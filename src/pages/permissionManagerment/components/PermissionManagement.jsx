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
  Select,
  Popconfirm
} from 'antd'
import { 
  LockOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { usePermissionStore, PERMISSION_TYPES } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'
import PermissionButton from './PermissionButton'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const PermissionManagement = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { 
    permissions, 
    roles,
    addPermission, 
    updatePermission, 
    deletePermission 
  } = usePermissionStore()
  
  const { userInfo } = useUserStore()



  // 获取权限类型颜色
  const getPermissionTypeColor = (type) => {
    switch (type) {
      case PERMISSION_TYPES.MENU:
        return 'blue'
      case PERMISSION_TYPES.BUTTON:
        return 'green'
      case PERMISSION_TYPES.API:
        return 'orange'
      case PERMISSION_TYPES.DATA:
        return 'purple'
      default:
        return 'default'
    }
  }

  // 获取权限类型文本
  const getPermissionTypeText = (type) => {
    switch (type) {
      case PERMISSION_TYPES.MENU:
        return '菜单权限'
      case PERMISSION_TYPES.BUTTON:
        return '按钮权限'
      case PERMISSION_TYPES.API:
        return 'API权限'
      case PERMISSION_TYPES.DATA:
        return '数据权限'
      default:
        return '未知类型'
    }
  }

  // 获取权限使用情况
  const getPermissionUsage = (permissionCode) => {
    return roles.filter(role => role.permissions?.includes(permissionCode)).length
  }

  // 表格列定义
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <LockOutlined style={{ color: getPermissionTypeColor(record.type) }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.code}</div>
          </div>
        </Space>
      )
    },
    {
      title: '权限类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={getPermissionTypeColor(type)}>
          {getPermissionTypeText(type)}
        </Tag>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '使用情况',
      key: 'usage',
      render: (_, record) => {
        const usage = getPermissionUsage(record.code)
        return (
          <Tag color={usage > 0 ? 'green' : 'default'}>
            {usage} 个角色使用
          </Tag>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <PermissionButton
            permission="permission:manage"
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
            title="确定要删除这个权限吗？"
            description="删除后相关角色的权限也会被移除，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <PermissionButton
              permission="permission:manage"
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
        </Space>
      )
    }
  ]

  // 处理添加权限
  const handleAdd = () => {
    setSelectedPermission(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 处理编辑权限
  const handleEdit = (permission) => {
    setSelectedPermission(permission)
    form.setFieldsValue({
      name: permission.name,
      code: permission.code,
      type: permission.type,
      description: permission.description
    })
    setIsModalVisible(true)
  }

  // 处理删除权限
  const handleDelete = async (permissionId) => {
    try {
      deletePermission(permissionId)
      message.success('权限删除成功')
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedPermission) {
        // 编辑权限
        updatePermission(selectedPermission.id, values)
        message.success('权限更新成功')
      } else {
        // 添加权限
        addPermission(values)
        message.success('权限创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
      setSelectedPermission(null)
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
    setSelectedPermission(null)
  }

  // 统计信息
  const getStatistics = () => {
    const totalPermissions = permissions.length
    const menuPermissions = permissions.filter(p => p.type === PERMISSION_TYPES.MENU).length
    const buttonPermissions = permissions.filter(p => p.type === PERMISSION_TYPES.BUTTON).length
    const apiPermissions = permissions.filter(p => p.type === PERMISSION_TYPES.API).length
    const dataPermissions = permissions.filter(p => p.type === PERMISSION_TYPES.DATA).length
    const unusedPermissions = permissions.filter(p => getPermissionUsage(p.code) === 0).length

    return {
      total: totalPermissions,
      menu: menuPermissions,
      button: buttonPermissions,
      api: apiPermissions,
      data: dataPermissions,
      unused: unusedPermissions
    }
  }

  const stats = getStatistics()

  // 权限类型选项
  const permissionTypeOptions = [
    { value: PERMISSION_TYPES.MENU, label: '菜单权限', description: '控制页面和菜单的访问' },
    { value: PERMISSION_TYPES.BUTTON, label: '按钮权限', description: '控制操作按钮的显示' },
    { value: PERMISSION_TYPES.API, label: 'API权限', description: '控制后端接口的访问' },
    { value: PERMISSION_TYPES.DATA, label: '数据权限', description: '控制数据的访问范围' }
  ]

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>权限管理</Title>
          <PermissionButton
            permission="permission:manage"
            buttonProps={{
              type: 'primary',
              icon: <PlusOutlined />
            }}
            onClick={handleAdd}
          >
            添加权限
          </PermissionButton>
        </div>

        {/* 统计信息 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={4}>
            <Statistic
              title="权限总数"
              value={stats.total}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="菜单权限"
              value={stats.menu}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="按钮权限"
              value={stats.button}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="API权限"
              value={stats.api}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="数据权限"
              value={stats.data}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="未使用权限"
              value={stats.unused}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 权限表单模态框 */}
      <Modal
        title={selectedPermission ? '编辑权限' : '添加权限'}
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
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="权限代码"
            rules={[
              { required: true, message: '请输入权限代码' },
              { pattern: /^[a-z:]+$/, message: '权限代码只能包含小写字母和冒号' }
            ]}
          >
            <Input placeholder="请输入权限代码，如：user:manage" />
          </Form.Item>

          <Form.Item
            name="type"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select placeholder="请选择权限类型">
              {permissionTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{option.description}</div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="权限描述"
            rules={[{ required: true, message: '请输入权限描述' }]}
          >
            <TextArea 
              placeholder="请输入权限描述" 
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PermissionManagement

import React, { useState } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Alert, 
  Divider,
  Row,
  Col,
  List,
  Descriptions,
  Switch
} from 'antd'
import { 
  LockOutlined, 
  UserOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { usePermissionStore, DEFAULT_PERMISSIONS } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'
import PermissionButton from './PermissionButton'
import PermissionWrapper from './PermissionWrapper'
import usePermission from '../hooks/usePermission'

const { Title, Text, Paragraph } = Typography

const PermissionDemo = () => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const { 
    roles, 
    permissions, 
    getUserPermissions, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = usePermissionStore()
  
  const { userInfo } = useUserStore()
  const { 
    checkPermission, 
    checkAnyPermission, 
    checkAllPermissions, 
    getCurrentUserPermissions,
    isSuperAdmin,
    isAdmin 
  } = usePermission()

  // 获取当前用户权限
  const currentUserPermissions = getCurrentUserPermissions()

  // 演示权限检查
  const demoPermissions = [
    {
      name: '用户管理权限',
      code: DEFAULT_PERMISSIONS.USER_MANAGE,
      description: '检查是否有用户管理权限'
    },
    {
      name: '角色管理权限',
      code: DEFAULT_PERMISSIONS.ROLE_MANAGE,
      description: '检查是否有角色管理权限'
    },
    {
      name: '内容创建权限',
      code: DEFAULT_PERMISSIONS.CONTENT_CREATE,
      description: '检查是否有内容创建权限'
    },
    {
      name: '内容删除权限',
      code: DEFAULT_PERMISSIONS.CONTENT_DELETE,
      description: '检查是否有内容删除权限'
    }
  ]

  // 演示数据
  const demoData = [
    { id: 1, name: '示例数据1', status: 'active' },
    { id: 2, name: '示例数据2', status: 'inactive' },
    { id: 3, name: '示例数据3', status: 'active' }
  ]

  return (
    <div>
      <Card>
        <Title level={3}>权限控制演示</Title>
        <Text type="secondary">
          展示权限管理系统的各种功能和使用方法
        </Text>
      </Card>

      {/* 当前用户信息 */}
      <Card title="当前用户信息" style={{ marginTop: '16px' }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="用户名">
            {userInfo?.username || '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            <Tag color="blue">{userInfo?.role || '未知'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="权限数量">
            <Tag color="green">{currentUserPermissions.length} 个</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="是否超级管理员">
            <Tag color={isSuperAdmin() ? 'red' : 'default'}>
              {isSuperAdmin() ? '是' : '否'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="是否管理员">
            <Tag color={isAdmin() ? 'orange' : 'default'}>
              {isAdmin() ? '是' : '否'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: '16px' }}>
          <Text strong>当前权限列表：</Text>
          <div style={{ marginTop: '8px' }}>
            <Space wrap>
              {currentUserPermissions.map((permission, index) => (
                <Tag key={index} color="blue">
                  {permission}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      </Card>

      {/* 权限检查演示 */}
      <Card title="权限检查演示" style={{ marginTop: '16px' }}>
        <List
          dataSource={demoPermissions}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
              <Space>
                <Tag color={checkPermission(item.code) ? 'green' : 'red'}>
                  {checkPermission(item.code) ? '有权限' : '无权限'}
                </Tag>
                <PermissionButton
                  permission={item.code}
                  buttonProps={{
                    type: 'primary',
                    size: 'small'
                  }}
                >
                  测试按钮
                </PermissionButton>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {/* 权限控制组件演示 */}
      <Card title="权限控制组件演示" style={{ marginTop: '16px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="PermissionButton 组件">
              <Space direction="vertical" style={{ width: '100%' }}>
                <PermissionButton
                  permission={DEFAULT_PERMISSIONS.CONTENT_CREATE}
                  buttonProps={{
                    type: 'primary',
                    icon: <PlusOutlined />
                  }}
                >
                  创建内容（需要内容创建权限）
                </PermissionButton>
                
                <PermissionButton
                  permission={DEFAULT_PERMISSIONS.CONTENT_EDIT}
                  buttonProps={{
                    type: 'default',
                    icon: <EditOutlined />
                  }}
                >
                  编辑内容（需要内容编辑权限）
                </PermissionButton>
                
                <PermissionButton
                  permission={DEFAULT_PERMISSIONS.CONTENT_DELETE}
                  buttonProps={{
                    type: 'primary',
                    danger: true,
                    icon: <DeleteOutlined />
                  }}
                >
                  删除内容（需要内容删除权限）
                </PermissionButton>
                
                <PermissionButton
                  permissions={[DEFAULT_PERMISSIONS.USER_MANAGE, DEFAULT_PERMISSIONS.ROLE_MANAGE]}
                  buttonProps={{
                    type: 'dashed'
                  }}
                >
                  系统管理（需要用户管理或角色管理权限）
                </PermissionButton>
              </Space>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card size="small" title="PermissionWrapper 组件">
              <Space direction="vertical" style={{ width: '100%' }}>
                <PermissionWrapper permission={DEFAULT_PERMISSIONS.CONTENT_VIEW}>
                  <Alert
                    message="内容查看区域"
                    description="只有拥有内容查看权限的用户才能看到此区域"
                    type="info"
                    showIcon
                  />
                </PermissionWrapper>
                
                <PermissionWrapper 
                  permission={DEFAULT_PERMISSIONS.USER_MANAGE}
                  fallback={
                    <Alert
                      message="无权限访问"
                      description="您没有用户管理权限"
                      type="warning"
                      showIcon
                    />
                  }
                  hideOnNoPermission={false}
                >
                  <Alert
                    message="用户管理区域"
                    description="只有拥有用户管理权限的用户才能看到此区域"
                    type="success"
                    showIcon
                  />
                </PermissionWrapper>
                
                <PermissionWrapper 
                  permissions={[DEFAULT_PERMISSIONS.ROLE_MANAGE, DEFAULT_PERMISSIONS.PERMISSION_MANAGE]}
                  requireAll={true}
                >
                  <Alert
                    message="高级管理区域"
                    description="需要同时拥有角色管理和权限管理权限"
                    type="error"
                    showIcon
                  />
                </PermissionWrapper>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 数据权限演示 */}
      <Card title="数据权限演示" style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Text>显示高级功能：</Text>
            <Switch 
              checked={showAdvanced} 
              onChange={setShowAdvanced}
            />
          </Space>
        </div>
        
        <List
          dataSource={demoData}
          renderItem={item => (
            <List.Item
              actions={[
                <PermissionButton
                  key="view"
                  permission={DEFAULT_PERMISSIONS.CONTENT_VIEW}
                  buttonProps={{
                    type: 'link',
                    icon: <EyeOutlined />
                  }}
                >
                  查看
                </PermissionButton>,
                <PermissionButton
                  key="edit"
                  permission={DEFAULT_PERMISSIONS.CONTENT_EDIT}
                  buttonProps={{
                    type: 'link',
                    icon: <EditOutlined />
                  }}
                >
                  编辑
                </PermissionButton>,
                <PermissionWrapper
                  key="delete"
                  permission={DEFAULT_PERMISSIONS.CONTENT_DELETE}
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </PermissionWrapper>
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`状态: ${item.status}`}
              />
            </List.Item>
          )}
        />
        
        {showAdvanced && (
          <PermissionWrapper permission={DEFAULT_PERMISSIONS.MONITOR_VIEW}>
            <Divider />
            <Alert
              message="高级功能区域"
              description="这是一个需要监控查看权限的高级功能区域"
              type="success"
              showIcon
            />
          </PermissionWrapper>
        )}
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: '16px' }}>
        <Title level={4}>1. PermissionButton 组件</Title>
        <Paragraph>
          用于控制按钮的显示和操作权限。如果用户没有相应权限，按钮会被禁用或隐藏。
        </Paragraph>
        
        <Title level={4}>2. PermissionWrapper 组件</Title>
        <Paragraph>
          用于包装任意组件，控制其显示权限。可以设置无权限时的替代内容。
        </Paragraph>
        
        <Title level={4}>3. usePermission Hook</Title>
        <Paragraph>
          提供权限检查的工具函数，可以在组件中直接使用。
        </Paragraph>
        
        <Title level={4}>4. 权限类型</Title>
        <Paragraph>
          <ul>
            <li><Text strong>菜单权限：</Text>控制页面和菜单的访问</li>
            <li><Text strong>按钮权限：</Text>控制操作按钮的显示</li>
            <li><Text strong>API权限：</Text>控制后端接口的访问</li>
            <li><Text strong>数据权限：</Text>控制数据的访问范围</li>
          </ul>
        </Paragraph>
      </Card>
    </div>
  )
}

export default PermissionDemo

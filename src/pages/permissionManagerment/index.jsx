import React, { useState } from 'react'
import { Tabs, Card, Typography, Row, Col, Statistic, Space, Tag } from 'antd'
import { 
  TeamOutlined, 
  LockOutlined, 
  UserOutlined, 
  SettingOutlined,
  SafetyOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { usePermissionStore } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'
import RoleManagement from './components/RoleManagement'
import PermissionManagement from './components/PermissionManagement'
import UserPermissionAssignment from './components/UserPermissionAssignment'
import PermissionDemo from './components/PermissionDemo'
import PermissionTest from './components/PermissionTest'
import PermissionWrapper from './components/PermissionWrapper'

const { Title, Text } = Typography
const { TabPane } = Tabs

const PermissionManagementPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  const { roles, permissions, getUserPermissions } = usePermissionStore()
  const { userInfo } = useUserStore()

  // 获取当前用户权限
  const currentUserPermissions = getUserPermissions()

  // 统计信息
  const getStatistics = () => {
    const totalRoles = roles.length
    const totalPermissions = permissions.length
    const menuPermissions = permissions.filter(p => p.type === 'menu').length
    const buttonPermissions = permissions.filter(p => p.type === 'button').length
    const apiPermissions = permissions.filter(p => p.type === 'api').length
    const dataPermissions = permissions.filter(p => p.type === 'data').length

    return {
      roles: totalRoles,
      permissions: totalPermissions,
      menu: menuPermissions,
      button: buttonPermissions,
      api: apiPermissions,
      data: dataPermissions
    }
  }

  const stats = getStatistics()

  // 权限概览组件
  const OverviewTab = () => (
    <div>
      <Card>
        <Title level={3}>权限系统概览</Title>
        
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="角色总数"
                value={stats.roles}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="权限总数"
                value={stats.permissions}
                prefix={<LockOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="菜单权限"
                value={stats.menu}
                prefix={<SettingOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="按钮权限"
                value={stats.button}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 当前用户权限信息 */}
        <Card title="当前用户权限信息" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <Text strong>用户名：</Text>
                <Text>{userInfo?.username || '未知'}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>角色：</Text>
                <Tag color="blue">{userInfo?.role || '未知'}</Tag>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>权限数量：</Text>
                <Tag color="green">{currentUserPermissions.length} 个</Tag>
              </div>
            </Col>
          </Row>
          
          <div style={{ marginTop: '16px' }}>
            <Text strong>权限列表：</Text>
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

        {/* 角色列表 */}
        <Card title="角色列表">
          <Row gutter={16}>
            {roles.map(role => (
              <Col span={8} key={role.id} style={{ marginBottom: '16px' }}>
                <Card size="small" hoverable>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{role.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{role.description}</div>
                    </div>
                    <Tag color="purple">{role.permissions?.length || 0} 权限</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Card>
    </div>
  )

  // 标签页配置
  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined />
          系统概览
        </span>
      ),
      children: <OverviewTab />
    },
    {
      key: 'roles',
      label: (
        <span>
          <TeamOutlined />
          角色管理
        </span>
      ),
      children: <RoleManagement />
    },
    {
      key: 'permissions',
      label: (
        <span>
          <LockOutlined />
          权限管理
        </span>
      ),
      children: <PermissionManagement />
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          用户权限分配
        </span>
      ),
      children: (
        <PermissionWrapper permission="user:manage">
          <UserPermissionAssignment />
        </PermissionWrapper>
      )
    },
    {
      key: 'demo',
      label: (
        <span>
          <ExperimentOutlined />
          权限演示
        </span>
      ),
      children: <PermissionDemo />
    },
    {
      key: 'test',
      label: (
        <span>
          <CheckCircleOutlined />
          功能测试
        </span>
      ),
      children: <PermissionTest />
    }
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Title level={2}>权限管理系统</Title>
          <Text type="secondary">
            管理系统角色、权限和用户权限分配
          </Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="large"
        />
      </Card>
    </div>
  )
}

export default PermissionManagementPage

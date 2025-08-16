import React from 'react'
import { Card, Button, Space, Typography, Alert, Tag } from 'antd'
import { usePermissionStore } from '@/store/zustand'
import { useUserStore } from '@/store/zustand'
import PermissionButton from './PermissionButton'
import PermissionWrapper from './PermissionWrapper'

const { Title, Text } = Typography

const PermissionTest = () => {
  const { roles, permissions, getUserPermissions } = usePermissionStore()
  const { userInfo } = useUserStore()

  const currentUserPermissions = getUserPermissions()

  return (
    <div>
      <Card>
        <Title level={3}>权限系统测试</Title>
        <Text type="secondary">验证权限管理系统的基本功能</Text>
      </Card>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginTop: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>当前用户：</Text>
            <Text>{userInfo?.username || '未知'}</Text>
          </div>
          <div>
            <Text strong>用户角色：</Text>
            <Tag color="blue">{userInfo?.role || '未知'}</Tag>
          </div>
          <div>
            <Text strong>权限数量：</Text>
            <Tag color="green">{currentUserPermissions.length} 个</Tag>
          </div>
        </Space>
      </Card>

      {/* 权限按钮测试 */}
      <Card title="权限按钮测试" style={{ marginTop: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <PermissionButton permission="user:manage">
            用户管理按钮
          </PermissionButton>
          
          <PermissionButton permission="role:manage">
            角色管理按钮
          </PermissionButton>
          
          <PermissionButton permission="content:create">
            创建内容按钮
          </PermissionButton>
          
          <PermissionButton permission="content:delete">
            删除内容按钮
          </PermissionButton>
        </Space>
      </Card>

      {/* 权限包装测试 */}
      <Card title="权限包装测试" style={{ marginTop: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <PermissionWrapper permission="user:manage">
            <Alert
              message="用户管理区域"
              description="只有拥有用户管理权限的用户才能看到此区域"
              type="success"
              showIcon
            />
          </PermissionWrapper>
          
          <PermissionWrapper 
            permission="role:manage"
            fallback={
              <Alert
                message="无权限访问"
                description="您没有角色管理权限"
                type="warning"
                showIcon
              />
            }
            hideOnNoPermission={false}
          >
            <Alert
              message="角色管理区域"
              description="只有拥有角色管理权限的用户才能看到此区域"
              type="info"
              showIcon
            />
          </PermissionWrapper>
        </Space>
      </Card>

      {/* 数据统计 */}
      <Card title="数据统计" style={{ marginTop: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>角色总数：</Text>
            <Tag color="blue">{roles.length}</Tag>
          </div>
          <div>
            <Text strong>权限总数：</Text>
            <Tag color="green">{permissions.length}</Tag>
          </div>
          <div>
            <Text strong>当前用户权限：</Text>
            <div style={{ marginTop: '8px' }}>
              {currentUserPermissions.map((permission, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                  {permission}
                </Tag>
              ))}
            </div>
          </div>
        </Space>
      </Card>

      {/* 测试结果 */}
      <Card title="测试结果" style={{ marginTop: '16px' }}>
        <Alert
          message="权限管理系统测试完成"
          description="如果能看到此页面，说明权限管理系统已成功集成到项目中"
          type="success"
          showIcon
        />
      </Card>
    </div>
  )
}

export default PermissionTest

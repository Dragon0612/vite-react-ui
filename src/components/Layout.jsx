import React, { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileOutlined,
  BarChartOutlined,
  FileTextOutlined,
  MonitorOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  PhoneOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useUserStore } from '@/store/zustand'
import { routes } from '@/router'

const { Header, Sider, Content } = Layout

// 图标映射
const iconMap = {
  'dashboard': <DashboardOutlined />,
  'user': <TeamOutlined />,
  'file': <FileOutlined />,
  'bar-chart': <BarChartOutlined />,
  'file-text': <FileTextOutlined />,
  'setting': <SettingOutlined />,
  'monitor': <MonitorOutlined />,
  'info-circle': <InfoCircleOutlined />,
  'question-circle': <QuestionCircleOutlined />,
  'phone': <PhoneOutlined />
}

// 从路由配置生成菜单项
const generateMenuItems = () => {
  const adminRoute = routes.find(route => route.path === '/')
  if (!adminRoute || !adminRoute.children) return []
  
  return adminRoute.children
    .filter(route => route.meta?.showInMenu)
    .map(route => {
      // 如果是菜单组（有children且isGroup为true）
      if (route.meta?.isGroup && route.children) {
        return {
          key: `/${route.path}`, // 菜单组的路径
          icon: iconMap[route.meta?.icon] || <DashboardOutlined />,
          label: route.meta?.title || route.name,
          children: route.children
            .filter(child => child.meta?.showInMenu)
            .map(child => ({
              key: `/${route.path}/${child.path}`, // 完整的子菜单路径
              icon: iconMap[child.meta?.icon] || <DashboardOutlined />,
              label: child.meta?.title || child.name
            }))
        }
      }
      
      // 普通菜单项
      return {
        key: route.path === '' ? '/' : `/${route.path}`,
        icon: iconMap[route.meta?.icon] || <DashboardOutlined />,
        label: route.meta?.title || route.name
      }
    })
}

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // 使用Zustand状态管理
  const { userInfo, logout } = useUserStore()

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置'
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      // 使用Zustand登出
      logout()
      navigate('/login')
    } else if (key === 'profile') {
      navigate('/profile')
    }
  }

  const getSelectedKeys = () => {
    return [location.pathname]
  }

  const sidebarMenuItems = generateMenuItems()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#001529',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '16px' : '20px',
          fontWeight: 'bold',
          borderBottom: '1px solid #303030'
        }}>
          {collapsed ? 'AD' : 'Admin'}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={sidebarMenuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: '#001529'
          }}
        />
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <Space size="large">
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>

            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span style={{ color: '#666' }}>
                  {userInfo?.username || '管理员'}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '6px',
          minHeight: '280px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout 
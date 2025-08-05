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
  FileTextOutlined,
  ShoppingOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const { Header, Sider, Content } = Layout

// 侧边栏菜单配置
const sidebarMenuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: '仪表盘',
    children: [
      { key: '/admin', label: '概览' },
      { key: '/admin/analytics', label: '数据分析' }
    ]
  },
  {
    key: '/admin/user',
    icon: <TeamOutlined />,
    label: '用户管理',
    children: [
      { key: '/admin/users', label: '用户列表' },
      { key: '/admin/user-roles', label: '角色管理' }
    ]
  },
  {
    key: '/admin/content',
    icon: <FileTextOutlined />,
    label: '内容管理',
    children: [
      { key: '/admin/articles', label: '文章管理' },
      { key: '/admin/categories', label: '分类管理' }
    ]
  },
  {
    key: '/admin/product',
    icon: <ShoppingOutlined />,
    label: '商品管理',
    children: [
      { key: '/admin/products', label: '商品列表' },
      { key: '/admin/orders', label: '订单管理' }
    ]
  },
  {
    key: '/admin/system',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      { key: '/admin/settings', label: '基本设置' },
      { key: '/admin/logs', label: '系统日志' }
    ]
  }
]

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

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token')
      navigate('/login')
    } else if (key === 'profile') {
      navigate('/admin/profile')
    }
  }

  const getSelectedKeys = () => {
    return [location.pathname]
  }

  const getOpenKeys = () => {
    const pathname = location.pathname
    const openKeys = []
    
    sidebarMenuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.key === pathname
        )
        if (hasActiveChild) {
          openKeys.push(item.key)
        }
      }
    })
    
    return openKeys
  }

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
          defaultOpenKeys={getOpenKeys()}
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
                <span style={{ color: '#666' }}>管理员</span>
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
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Button, Space } from 'antd'
import { 
  HomeOutlined, 
  InfoCircleOutlined, 
  AntDesignOutlined, 
  BgColorsOutlined, 
  ApiOutlined, 
  UserOutlined,
  ExperimentOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { getMenuItems } from '@/router'

// 图标映射
const iconMap = {
  home: <HomeOutlined />,
  info: <InfoCircleOutlined />,
  'ant-design': <AntDesignOutlined />,
  style: <BgColorsOutlined />,
  api: <ApiOutlined />,
  user: <UserOutlined />,
  example: <ExperimentOutlined />,
  admin: <SettingOutlined />
}

function Navigation() {
  const location = useLocation()
  const menuItems = getMenuItems()

  // 生成菜单项
  const items = menuItems.map(route => ({
    key: route.path,
    icon: iconMap[route.meta.icon] || <HomeOutlined />,
    label: (
      <Link to={route.path}>
        {route.meta.title}
      </Link>
    )
  }))

  return (
    <div style={{ 
      borderBottom: '1px solid #f0f0f0',
      marginBottom: '20px',
      padding: '0 24px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '64px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          Vite React UI
        </div>
        
        <Space>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ 
              borderBottom: 'none',
              background: 'transparent'
            }}
          />
          
          <Button 
            type="primary" 
            icon={<SettingOutlined />}
            onClick={() => window.location.href = '/admin'}
          >
            后台管理
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Navigation 
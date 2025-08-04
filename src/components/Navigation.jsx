import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { 
  HomeOutlined, 
  InfoCircleOutlined, 
  AntDesignOutlined, 
  BgColorsOutlined, 
  ApiOutlined, 
  UserOutlined,
  ExperimentOutlined
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
  example: <ExperimentOutlined />
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
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      style={{ 
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '20px'
      }}
    />
  )
}

export default Navigation 
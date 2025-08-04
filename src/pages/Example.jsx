import React from 'react'
import { Card, Typography, Space, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

function Example() {
  return (
    <div className="container">
      <div className="text-center mb-4">
        <Title level={1} className="text-primary">路由配置示例</Title>
        <Paragraph className="text-secondary">
          这是一个新添加的页面，用于演示路由配置系统
        </Paragraph>
      </div>

      <Card title="路由配置说明" className="mb-4">
        <div className="space-y-4">
          <div>
            <Text strong>配置位置：</Text>
            <div className="mt-1">
              <Text code>src/router/index.js</Text>
            </div>
          </div>

          <div>
            <Text strong>添加新路由的步骤：</Text>
            <ol className="ml-4 mt-2 space-y-1">
              <li>1. 创建页面组件（如本页面）</li>
              <li>2. 在 <Text code>src/router/index.js</Text> 中添加路由配置</li>
              <li>3. 在 <Text code>src/components/Navigation.jsx</Text> 中添加图标映射</li>
            </ol>
          </div>
        </div>
      </Card>

      <Card title="路由配置示例" className="mb-4">
        <div className="space-y-3">
          <div>
            <Text strong>路由配置：</Text>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
{`{
  path: '/example',
  name: '示例页面',
  component: lazy(() => import('@/pages/Example')),
  meta: {
    title: '路由配置示例',
    icon: 'example',
    showInMenu: true,
    requiresAuth: false
  }
}`}
            </pre>
          </div>

          <div>
            <Text strong>图标映射：</Text>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
{`const iconMap = {
  // ... 其他图标
  example: <ExampleOutlined />
}`}
            </pre>
          </div>
        </div>
      </Card>

      <Card title="特性">
        <div className="space-y-2">
          <div className="flex items-center">
            <CheckOutlined className="text-success mr-2" />
            <span>懒加载：页面按需加载，提高性能</span>
          </div>
          <div className="flex items-center">
            <CheckOutlined className="text-success mr-2" />
            <span>集中管理：所有路由在一个文件中配置</span>
          </div>
          <div className="flex items-center">
            <CheckOutlined className="text-success mr-2" />
            <span>自动菜单：根据配置自动生成导航菜单</span>
          </div>
          <div className="flex items-center">
            <CheckOutlined className="text-success mr-2" />
            <span>权限控制：支持路由级别的权限控制</span>
          </div>
          <div className="flex items-center">
            <CheckOutlined className="text-success mr-2" />
            <span>加载状态：路由切换时显示加载动画</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Example 
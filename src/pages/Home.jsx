import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Space, Typography, Row, Col, Divider, message } from 'antd'
import { PlusOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

const { Title, Paragraph, Text } = Typography

function Home() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount((count) => count + 1)
    message.success('计数器已更新！')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="h-24 w-24 animate-spin" alt="React logo" />
            </a>
          </div>
          <Title level={1}>Vite + React + Ant Design</Title>
          <Paragraph className="text-gray-600 mb-8">现代化的React开发环境，集成 Ant Design 4.x</Paragraph>
        </div>

        <Card className="mb-8">
          <div className="text-center">
            <Space direction="vertical" size="large">
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={handleClick}
              >
                计数器: {count}
              </Button>
              <Paragraph className="text-gray-600">
                编辑 <Text code>src/pages/Home.jsx</Text> 并保存以测试热重载
              </Paragraph>
            </Space>
          </div>
        </Card>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} md={12}>
            <Card 
              title="项目特性" 
              extra={<HeartOutlined style={{ color: '#ff4d4f' }} />}
            >
              <ul className="space-y-2 text-gray-600">
                <li>• Vite 快速构建工具</li>
                <li>• React 19 最新版本</li>
                <li>• Ant Design 4.x UI 组件库</li>
                <li>• Tailwind CSS 样式框架</li>
                <li>• React Router 路由管理</li>
                <li>• Redux Toolkit 状态管理</li>
                <li>• Axios HTTP 客户端</li>
              </ul>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card 
              title="快速开始" 
              extra={<StarOutlined style={{ color: '#faad14' }} />}
            >
              <div className="space-y-2 text-gray-600">
                <p>• 运行 <Text code>yarn dev</Text> 启动开发服务器</p>
                <p>• 运行 <Text code>yarn build</Text> 构建生产版本</p>
                <p>• 运行 <Text code>yarn preview</Text> 预览构建结果</p>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div className="text-center">
          <Space size="large">
            <Link to="/about">
              <Button type="primary" size="large">
                关于页面
              </Button>
            </Link>
            <Link to="/demo">
              <Button type="default" size="large">
                Ant Design 演示
              </Button>
            </Link>
            <Link to="/style-demo">
              <Button type="default" size="large">
                Less 样式演示
              </Button>
            </Link>
            <Link to="/request-demo">
              <Button type="default" size="large">
                请求函数演示
              </Button>
            </Link>
            <Button 
              type="dashed" 
              size="large"
              onClick={() => message.info('这是一个 Ant Design 消息提示！')}
            >
              测试消息提示
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default Home 
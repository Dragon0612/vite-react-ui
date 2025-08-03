import { Link } from 'react-router-dom'
import { Card, Typography, Row, Col, Divider, Space, Tag, Button } from 'antd'
import { HomeOutlined, CodeOutlined, ToolOutlined, FolderOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Title level={1}>关于项目</Title>
          <Paragraph className="text-gray-600">这是一个使用现代技术栈构建的React应用，集成 Ant Design 4.x</Paragraph>
        </div>

        <Card className="mb-8">
          <Title level={2}>技术栈</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <CodeOutlined />
                    <span>前端框架</span>
                  </Space>
                }
                size="small"
              >
                <ul className="space-y-2 text-gray-600">
                  <li>• React 19 - 用户界面库</li>
                  <li>• Vite - 构建工具</li>
                  <li>• React Router - 路由管理</li>
                  <li>• Redux Toolkit - 状态管理</li>
                  <li>• Ant Design 4.x - UI 组件库</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <ToolOutlined />
                    <span>样式和工具</span>
                  </Space>
                }
                size="small"
              >
                <ul className="space-y-2 text-gray-600">
                  <li>• Tailwind CSS - 样式框架</li>
                  <li>• Axios - HTTP 客户端</li>
                  <li>• ESLint - 代码检查</li>
                  <li>• PostCSS - CSS 处理</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card className="mb-8">
          <Title level={2}>项目结构</Title>
          <div className="space-y-4 text-gray-600">
            <div>
              <Space>
                <FolderOutlined />
                <Text strong>src/</Text>
              </Space>
              <ul className="ml-8 space-y-1 mt-2">
                <li>• components/ - 可复用组件</li>
                <li>• pages/ - 页面组件</li>
                <li>• store/ - Redux 状态管理</li>
                <li>• hooks/ - 自定义 Hooks</li>
                <li>• utils/ - 工具函数</li>
                <li>• assets/ - 静态资源</li>
              </ul>
            </div>
          </div>
        </Card>

        <Divider />

        <div className="text-center">
          <Space size="large">
            <Link to="/">
              <Button type="primary" icon={<HomeOutlined />}>
                返回首页
              </Button>
            </Link>
            <Space>
              <Tag color="blue">React 19</Tag>
              <Tag color="green">Vite</Tag>
              <Tag color="orange">Ant Design</Tag>
              <Tag color="purple">Tailwind CSS</Tag>
            </Space>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default About 
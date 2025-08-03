import React, { useState } from 'react'
import { Button, Card, Space, Typography, Row, Col, Divider, message } from 'antd'
import { PlusOutlined, HeartOutlined, StarOutlined, CheckOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

function StyleDemo() {
  const [activeTab, setActiveTab] = useState('buttons')

  const handleClick = () => {
    message.success('按钮点击成功！')
  }

  return (
    <div className="container">
      {/* 页面标题 */}
      <div className="text-center mb-4">
        <Title level={1} className="text-primary">Less 样式系统演示</Title>
        <Paragraph className="text-secondary">
          展示如何使用 Less 变量、混入和工具类
        </Paragraph>
      </div>

      {/* 导航标签 */}
      <div className="flex-center mb-4">
        <Space>
          {['buttons', 'cards', 'layout', 'colors', 'spacing'].map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </Space>
      </div>

      {/* 按钮演示 */}
      {activeTab === 'buttons' && (
        <div className="fade-in">
          <Card title="按钮样式演示" className="card-hover">
            <div className="flex-center mb-3">
              <Space wrap>
                <button className="btn btn-primary">
                  <PlusOutlined /> 主要按钮
                </button>
                <button className="btn btn-secondary">
                  <HeartOutlined /> 次要按钮
                </button>
                <button className="btn" onClick={handleClick}>
                  基础按钮
                </button>
              </Space>
            </div>
            
            <Divider />
            
            <div className="text-center">
              <Paragraph className="text-secondary">
                使用 Less 混入定义的按钮样式，支持悬停效果和图标
              </Paragraph>
            </div>
          </Card>
        </div>
      )}

      {/* 卡片演示 */}
      {activeTab === 'cards' && (
        <div className="fade-in">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="基础卡片" className="card">
                <Paragraph>
                  这是一个使用 <Text code>.card</Text> 类的基础卡片
                </Paragraph>
                <div className="text-center">
                  <CheckOutlined className="text-success" style={{ fontSize: '2rem' }} />
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card title="悬停卡片" className="card-hover">
                <Paragraph>
                  这是一个使用 <Text code>.card-hover</Text> 类的悬停效果卡片
                </Paragraph>
                <div className="text-center">
                  <StarOutlined className="text-warning" style={{ fontSize: '2rem' }} />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* 布局演示 */}
      {activeTab === 'layout' && (
        <div className="fade-in">
          <Card title="布局演示" className="card">
            <div className="mb-3">
              <h4>弹性布局</h4>
              <div className="flex-between bg-light p-3 rounded">
                <span>左侧内容</span>
                <span>右侧内容</span>
              </div>
            </div>
            
            <div className="mb-3">
              <h4>居中对齐</h4>
              <div className="flex-center bg-light p-3 rounded">
                <span>居中内容</span>
              </div>
            </div>
            
            <div className="mb-3">
              <h4>垂直布局</h4>
              <div className="flex-column bg-light p-3 rounded">
                <span>第一项</span>
                <span>第二项</span>
                <span>第三项</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 颜色演示 */}
      {activeTab === 'colors' && (
        <div className="fade-in">
          <Card title="颜色系统演示" className="card">
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6}>
                <div className="text-center p-3 bg-primary text-white rounded">
                  <h5>主要色</h5>
                  <Text code>@primary-color</Text>
                </div>
              </Col>
              
              <Col xs={12} md={6}>
                <div className="text-center p-3 bg-success text-white rounded">
                  <h5>成功色</h5>
                  <Text code>@success-color</Text>
                </div>
              </Col>
              
              <Col xs={12} md={6}>
                <div className="text-center p-3 bg-warning text-white rounded">
                  <h5>警告色</h5>
                  <Text code>@warning-color</Text>
                </div>
              </Col>
              
              <Col xs={12} md={6}>
                <div className="text-center p-3 bg-error text-white rounded">
                  <h5>错误色</h5>
                  <Text code>@error-color</Text>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <div className="text-center">
              <h4 className="text-primary">主要文字</h4>
              <h4 className="text-success">成功文字</h4>
              <h4 className="text-warning">警告文字</h4>
              <h4 className="text-error">错误文字</h4>
              <h4 className="text-secondary">次要文字</h4>
            </div>
          </Card>
        </div>
      )}

      {/* 间距演示 */}
      {activeTab === 'spacing' && (
        <div className="fade-in">
          <Card title="间距系统演示" className="card">
            <div className="mb-3">
              <h4>上边距 (margin-top)</h4>
              <div className="bg-light p-2">
                <div className="bg-primary text-white p-2 mt-1">mt-1 (4px)</div>
                <div className="bg-primary text-white p-2 mt-2">mt-2 (8px)</div>
                <div className="bg-primary text-white p-2 mt-3">mt-3 (16px)</div>
                <div className="bg-primary text-white p-2 mt-4">mt-4 (24px)</div>
                <div className="bg-primary text-white p-2 mt-5">mt-5 (32px)</div>
              </div>
            </div>
            
            <div className="mb-3">
              <h4>下边距 (margin-bottom)</h4>
              <div className="bg-light p-2">
                <div className="bg-success text-white p-2 mb-1">mb-1 (4px)</div>
                <div className="bg-success text-white p-2 mb-2">mb-2 (8px)</div>
                <div className="bg-success text-white p-2 mb-3">mb-3 (16px)</div>
                <div className="bg-success text-white p-2 mb-4">mb-4 (24px)</div>
                <div className="bg-success text-white p-2 mb-5">mb-5 (32px)</div>
              </div>
            </div>
            
            <div className="mb-3">
              <h4>内边距 (padding)</h4>
              <div className="bg-light p-2">
                <div className="bg-warning text-white p-2">
                  <div className="bg-dark p-1 pt-1">pt-1 (4px)</div>
                  <div className="bg-dark p-1 pt-2">pt-2 (8px)</div>
                  <div className="bg-dark p-1 pt-3">pt-3 (16px)</div>
                  <div className="bg-dark p-1 pt-4">pt-4 (24px)</div>
                  <div className="bg-dark p-1 pt-5">pt-5 (32px)</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 响应式演示 */}
      <div className="mt-4">
        <Card title="响应式设计" className="card">
          <div className="text-center">
            <Paragraph>
              在不同屏幕尺寸下，布局会自动调整：
            </Paragraph>
            <div className="bg-light p-3 rounded">
              <div className="hidden md:visible">
                <Text strong>桌面端：显示完整内容</Text>
              </div>
              <div className="visible md:hidden">
                <Text strong>移动端：简化布局</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 动画演示 */}
      <div className="mt-4">
        <Card title="动画效果" className="card">
          <div className="text-center">
            <div className="fade-in bg-primary text-white p-4 rounded">
              <h3>淡入动画效果</h3>
              <Paragraph>
                使用 <Text code>.fade-in</Text> 类添加淡入动画
              </Paragraph>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StyleDemo 
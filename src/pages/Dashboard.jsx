import React from 'react'
import { Row, Col, Card, Statistic, Progress } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>仪表盘</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1234}
              prefix={<UserOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={567}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={89012}
              prefix={<DollarOutlined />}
              suffix="元"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="文章数量"
              value={89}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#ff4d4f' }}>
                  <ArrowDownOutlined /> 3%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="系统性能" size="small">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>CPU 使用率</span>
                <span>65%</span>
              </div>
              <Progress percent={65} status="active" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>内存使用率</span>
                <span>45%</span>
              </div>
              <Progress percent={45} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>磁盘使用率</span>
                <span>78%</span>
              </div>
              <Progress percent={78} status="exception" />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="快速操作" size="small">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <div style={{ marginTop: '8px' }}>用户管理</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <ShoppingCartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <div style={{ marginTop: '8px' }}>订单管理</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <div style={{ marginTop: '8px' }}>内容管理</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <DollarOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
                  <div style={{ marginTop: '8px' }}>财务管理</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="欢迎使用后台管理系统" size="small">
        <p>这是一个基础的后台管理框架，您可以在此基础上添加具体的业务功能。</p>
        <p>主要特性：</p>
        <ul>
          <li>响应式布局设计</li>
          <li>Ant Design 组件库</li>
          <li>React Router 路由管理</li>
          <li>Redux 状态管理</li>
          <li>模块化组件结构</li>
        </ul>
      </Card>
    </div>
  )
}

export default Dashboard 
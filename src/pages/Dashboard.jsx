import React from 'react'
import { Card, Row, Col, Statistic, Typography, Space, Tag } from 'antd'
import { 
  UserOutlined, 
  FileOutlined, 
  TeamOutlined, 
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useUserStore } from '@/store/zustand'

const { Title, Text } = Typography

const Dashboard = () => {
  const { userInfo, isLoggedIn, token } = useUserStore()

  return (
    <div>
      <Title level={2}>仪表盘</Title>
      
      {/* 用户信息卡片 */}
      <Card title="当前用户信息" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic 
              title="用户名" 
              value={userInfo?.username || '未登录'} 
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="用户角色" 
              value={userInfo?.role || '未知'} 
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="登录状态" 
              value={isLoggedIn ? '已登录' : '未登录'} 
              prefix={isLoggedIn ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
              valueStyle={{ color: isLoggedIn ? '#3f8600' : '#cf1322' }}
            />
          </Col>
        </Row>
        
        <div style={{ marginTop: '16px' }}>
          <Text strong>权限列表：</Text>
          <Space style={{ marginLeft: '8px' }}>
            {userInfo?.permissions?.map((permission, index) => (
              <Tag key={index} color="blue">{permission}</Tag>
            )) || <Text type="secondary">无权限信息</Text>}
          </Space>
        </div>
        
        {token && (
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary">Token: {token.substring(0, 20)}...</Text>
          </div>
        )}
      </Card>

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总文件数"
              value={93}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线用户"
              value={12}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统负载"
              value={68}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" style={{ marginTop: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" hoverable>
              <div style={{ textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <div style={{ marginTop: '8px' }}>用户管理</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" hoverable>
              <div style={{ textAlign: 'center' }}>
                <FileOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <div style={{ marginTop: '8px' }}>内容管理</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" hoverable>
              <div style={{ textAlign: 'center' }}>
                <BarChartOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                <div style={{ marginTop: '8px' }}>系统监控</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default Dashboard 
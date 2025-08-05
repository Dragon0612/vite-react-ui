import React from 'react'
import { Row, Col, Card, Statistic, Progress, Table, Tag } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'

// 模拟数据
const mockData = {
  statistics: {
    users: 1234,
    orders: 567,
    revenue: 89012,
    articles: 89
  },
  recentOrders: [
    {
      key: '1',
      orderNo: 'ORD001',
      customer: '张三',
      amount: 299.00,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      key: '2',
      orderNo: 'ORD002',
      customer: '李四',
      amount: 199.00,
      status: 'pending',
      date: '2024-01-14'
    },
    {
      key: '3',
      orderNo: 'ORD003',
      customer: '王五',
      amount: 599.00,
      status: 'processing',
      date: '2024-01-13'
    }
  ]
}

const Dashboard = () => {
  const statusColorMap = {
    completed: 'green',
    pending: 'orange',
    processing: 'blue',
    cancelled: 'red'
  }

  const statusTextMap = {
    completed: '已完成',
    pending: '待处理',
    processing: '处理中',
    cancelled: '已取消'
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColorMap[status]}>
          {statusTextMap[status]}
        </Tag>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>仪表盘</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={mockData.statistics.users}
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
              value={mockData.statistics.orders}
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
              value={mockData.statistics.revenue}
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
              value={mockData.statistics.articles}
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

      <Card title="最近订单" size="small">
        <Table
          columns={columns}
          dataSource={mockData.recentOrders}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default Dashboard 
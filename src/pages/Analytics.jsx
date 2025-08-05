import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined, 
  RiseOutlined 
} from '@ant-design/icons'

const Analytics = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>数据分析</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="访问量"
              value={11280}
              prefix={<UserOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="销售额"
              value={11280}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单数"
              value={1128}
              prefix={<ShoppingCartOutlined />}
              suffix="单"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="增长率"
              value={11.28}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h3>数据分析页面</h3>
        <p>这里将显示各种数据图表和分析内容</p>
      </Card>
    </div>
  )
}

export default Analytics 
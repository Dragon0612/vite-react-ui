import React from 'react'
import { Card, Table, Tag, Space, Button } from 'antd'
import { EyeOutlined, EditOutlined } from '@ant-design/icons'

const OrderManagement = () => {
  const [orders, setOrders] = React.useState([
    {
      key: '1',
      id: 'ORD001',
      customer: '张三',
      amount: 299.00,
      status: 'completed',
      createTime: '2024-01-15 10:30:00',
      paymentMethod: '支付宝'
    },
    {
      key: '2',
      id: 'ORD002',
      customer: '李四',
      amount: 199.00,
      status: 'pending',
      createTime: '2024-01-14 15:20:00',
      paymentMethod: '微信支付'
    },
    {
      key: '3',
      id: 'ORD003',
      customer: '王五',
      amount: 599.00,
      status: 'processing',
      createTime: '2024-01-13 09:15:00',
      paymentMethod: '银行卡'
    }
  ])

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
      dataIndex: 'id',
      key: 'id',
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
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>订单管理</h2>
      
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          pagination={{
            total: orders.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  )
}

export default OrderManagement 
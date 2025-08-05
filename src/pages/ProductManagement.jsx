import React from 'react'
import { Card, Table, Button, Space, Tag, Input, Modal, Form, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

const ProductManagement = () => {
  const [products, setProducts] = React.useState([
    {
      key: '1',
      id: 1,
      name: '商品1',
      category: '电子产品',
      price: 299.00,
      stock: 100,
      status: 'active',
      createTime: '2024-01-15'
    },
    {
      key: '2',
      id: 2,
      name: '商品2',
      category: '服装',
      price: 199.00,
      stock: 50,
      status: 'active',
      createTime: '2024-01-14'
    }
  ])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '上架' : '下架'}
        </Tag>
      ),
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
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>商品管理</h2>
      
      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <Search
            placeholder="搜索商品名称"
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            添加商品
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={products}
          pagination={{
            total: products.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  )
}

export default ProductManagement 
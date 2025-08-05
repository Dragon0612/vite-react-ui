import React from 'react'
import { Card, Table, Button, Space, Tag, Input } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

const { Search } = Input

const ContentManagement = () => {
  const [articles, setArticles] = React.useState([
    {
      key: '1',
      id: 1,
      title: '文章标题1',
      category: '技术',
      author: '张三',
      status: 'published',
      createTime: '2024-01-15 10:30:00',
      views: 1234
    },
    {
      key: '2',
      id: 2,
      title: '文章标题2',
      category: '新闻',
      author: '李四',
      status: 'draft',
      createTime: '2024-01-14 15:20:00',
      views: 567
    },
    {
      key: '3',
      id: 3,
      title: '文章标题3',
      category: '生活',
      author: '王五',
      status: 'published',
      createTime: '2024-01-13 09:15:00',
      views: 890
    }
  ])

  const statusColorMap = {
    published: 'green',
    draft: 'orange',
    archived: 'red'
  }

  const statusTextMap = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
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
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
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
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>内容管理</h2>
      
      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <Search
            placeholder="搜索文章标题"
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            添加文章
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={articles}
          pagination={{
            total: articles.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  )
}

export default ContentManagement 
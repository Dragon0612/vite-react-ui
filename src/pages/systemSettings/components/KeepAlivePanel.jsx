import React from 'react'
import { Card, Table, Button, Space, Tag, Tooltip, Popconfirm, message } from 'antd'
import { DeleteOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useKeepAlive } from '@/hooks/useKeepAlive'

/**
 * KeepAlive 管理面板组件
 * 显示缓存状态、管理缓存页面
 */
const KeepAlivePanel = () => {
  const {
    cachedPages,
    activePages,
    config,
    getCacheStats,
    removePage,
    clearCache,
    updateConfig,
    setMaxCache
  } = useKeepAlive()

  // 获取缓存统计信息
  const stats = getCacheStats()

  // 表格列定义
  const columns = [
    {
      title: '页面路径',
      dataIndex: 'path',
      key: 'path',
      render: (path) => (
        <Tooltip title={path}>
          <span style={{ maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {path}
          </span>
        </Tooltip>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const isActive = activePages.includes(record.path)
        const isCached = cachedPages.includes(record.path)
        
        return (
          <Space>
            {isCached && <Tag color="green">已缓存</Tag>}
            {isActive && <Tag color="blue">活跃</Tag>}
            {!isCached && <Tag color="default">未缓存</Tag>}
          </Space>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确定要移除这个页面的缓存吗？"
            onConfirm={() => {
              removePage(record.path)
              message.success('缓存已移除')
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              移除缓存
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 表格数据
  const tableData = Array.from(new Set([...cachedPages, ...activePages])).map(path => ({
    key: path,
    path,
    isCached: cachedPages.includes(path),
    isActive: activePages.includes(path)
  }))

  // 配置项
  const configItems = [
    {
      label: '最大缓存数量',
      value: config.maxCache,
      action: (
        <Space>
          <Button 
            size="small" 
            onClick={() => setMaxCache(Math.max(1, config.maxCache - 1))}
          >
            -
          </Button>
          <span>{config.maxCache}</span>
          <Button 
            size="small" 
            onClick={() => setMaxCache(config.maxCache + 1)}
          >
            +
          </Button>
        </Space>
      )
    },
    {
      label: '滚动位置恢复',
      value: config.scrollRestoration ? '启用' : '禁用',
      action: (
        <Button 
          size="small" 
          onClick={() => updateConfig({ scrollRestoration: !config.scrollRestoration })}
        >
          {config.scrollRestoration ? '禁用' : '启用'}
        </Button>
      )
    },
    {
      label: '自动清理',
      value: config.autoCleanup ? '启用' : '禁用',
      action: (
        <Button 
          size="small" 
          onClick={() => updateConfig({ autoCleanup: !config.autoCleanup })}
        >
          {config.autoCleanup ? '禁用' : '启用'}
        </Button>
      )
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      {/* 统计卡片 */}
      <div style={{ marginBottom: '20px' }}>
        <Space size="large">
          <Card size="small" style={{ width: 200 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {stats.totalCached}
              </div>
              <div>已缓存页面</div>
            </div>
          </Card>
          <Card size="small" style={{ width: 200 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {stats.activePages}
              </div>
              <div>活跃页面</div>
            </div>
          </Card>
          <Card size="small" style={{ width: 200 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {config.maxCache}
              </div>
              <div>最大缓存数</div>
            </div>
          </Card>
        </Space>
      </div>

      {/* 配置面板 */}
      <Card 
        title="缓存配置" 
        style={{ marginBottom: '20px' }}
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                clearCache()
                message.success('所有缓存已清空')
              }}
            >
              清空所有缓存
            </Button>
          </Space>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {configItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.label}:</span>
              <span>{item.action}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 缓存页面列表 */}
      <Card 
        title={
          <Space>
            <span>缓存页面管理</span>
            <Tooltip title="显示所有已缓存和活跃的页面">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个页面`
          }}
          size="small"
        />
      </Card>
    </div>
  )
}

export default KeepAlivePanel

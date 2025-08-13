import React, { useState } from 'react'
import { Tabs, Card, Typography, Space, Tag } from 'antd'
import { SettingOutlined, DatabaseOutlined, MonitorOutlined } from '@ant-design/icons'
import KeepAlivePanel from './components/KeepAlivePanel'
import { useKeepAlive } from '@/hooks/useKeepAlive'

const { Title, Paragraph } = Typography
const { TabPane } = Tabs

function SystemSettings() {
  const { getCacheStats } = useKeepAlive()
  const [activeTab, setActiveTab] = useState('general')

  const stats = getCacheStats()

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: '8px' }} />
        系统设置
      </Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        size="large"
      >
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              基本设置
            </span>
          } 
          key="general"
        >
          <Card title="基本系统信息">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>系统状态</Title>
                <Space>
                  <Tag color="green">运行正常</Tag>
                  <Tag color="blue">版本 1.0.0</Tag>
                  <Tag color="orange">开发环境</Tag>
                </Space>
              </div>
              
              <div>
                <Title level={4}>路由信息</Title>
                <Paragraph>
                  当前路径: <code>/system/settings</code>
                </Paragraph>
                <Paragraph>
                  如果您能看到这个页面，说明二级菜单路由配置成功！
                </Paragraph>
                <ul>
                  <li>菜单组：系统管理 (/system)</li>
                  <li>子菜单：系统设置 (/system/settings)</li>
                  <li>路由路径：/system/settings</li>
                </ul>
              </div>
            </Space>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <DatabaseOutlined />
              缓存管理
            </span>
          } 
          key="cache"
        >
          <KeepAlivePanel />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <MonitorOutlined />
              性能监控
            </span>
          } 
          key="performance"
        >
          <Card title="KeepAlive 性能统计">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>缓存统计</Title>
                <Space size="large">
                  <div>
                    <strong>已缓存页面:</strong> {stats.totalCached}
                  </div>
                  <div>
                    <strong>活跃页面:</strong> {stats.activePages}
                  </div>
                  <div>
                    <strong>最大缓存数:</strong> {stats.maxCache}
                  </div>
                </Space>
              </div>
              
              <div>
                <Title level={4}>当前页面状态</Title>
                <Space>
                  <div>
                    <strong>当前路径:</strong> {stats.currentPath}
                  </div>
                  <div>
                    <strong>缓存状态:</strong> 
                    {stats.isCurrentCached ? (
                      <Tag color="green">已缓存</Tag>
                    ) : (
                      <Tag color="default">未缓存</Tag>
                    )}
                  </div>
                  <div>
                    <strong>活跃状态:</strong> 
                    {stats.isCurrentActive ? (
                      <Tag color="blue">活跃</Tag>
                    ) : (
                      <Tag color="default">非活跃</Tag>
                    )}
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default SystemSettings 
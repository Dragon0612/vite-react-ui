import React from 'react'
import { Card, Row, Col, Button, Input, Switch, Alert, Tag, Space, Statistic, Typography } from 'antd'
import { SaveOutlined, ReloadOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { useAutoState, useFormState, usePageState, clearAllAutoStates } from '@/hooks/useAutoKeepAlive'

const { Title, Text } = Typography
const { TextArea } = Input

/**
 * 自动状态持久化演示页面
 * 只需要在路由中设置 keepAlive: true，状态就会自动持久化！
 */
function AutoKeepAliveDemo() {
  // 🎯 使用 useAutoState 替代 useState，自动持久化！
  const [count, setCount] = useAutoState(0, 'counter')
  const [name, setName] = useAutoState('', 'userName')
  const [isEnabled, setIsEnabled] = useAutoState(false, 'switchState')
  const [notes, setNotes] = useAutoState('', 'userNotes')

  // 🎯 使用 useFormState 管理表单数据，自动持久化！
  const { formData, updateField, resetForm } = useFormState({
    email: '',
    phone: '',
    address: '',
    preferences: {
      newsletter: false,
      notifications: true
    }
  })

  // 🎯 页面状态管理
  const { clearPageState, getPageInfo } = usePageState()

  // 获取页面信息
  const pageInfo = getPageInfo()

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <SaveOutlined /> 自动状态持久化演示
        </Title>
        <Text type="secondary">
          只需要在路由中设置 keepAlive: true，所有状态都会自动持久化！
        </Text>
        <div style={{ marginTop: '8px' }}>
          <Tag color="green">KeepAlive启用</Tag>
          <Tag color="blue">自动状态持久化</Tag>
          <Tag color="orange">无需手动配置</Tag>
        </div>
        
        <Alert
          message="🚀 使用方法超简单！"
          description={
            <div>
              <p><strong>1. 路由配置</strong>：只需设置 <code>keepAlive: true</code></p>
              <p><strong>2. 组件中</strong>：将 <code>useState</code> 替换为 <code>useAutoState</code></p>
              <p><strong>3. 自动完成</strong>：状态会自动保存和恢复，无需其他配置！</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: '16px' }}
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* 页面状态信息 */}
        <Col span={24}>
          <Card title="📊 页面状态信息">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic 
                  title="状态数量" 
                  value={pageInfo.stateCount} 
                  prefix={<SaveOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="页面路径" 
                  value={pageInfo.pathname}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="缓存键" 
                  value={pageInfo.pageKey.split('-').pop()}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="状态键" 
                  value={pageInfo.stateKeys.join(', ')}
                  valueStyle={{ fontSize: '12px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 基础状态演示 */}
        <Col span={12}>
          <Card title="🎯 基础状态演示（useAutoState）">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>计数器 (自动保存):</Text>
                <div style={{ marginTop: '8px' }}>
                  <Button 
                    type="primary" 
                    onClick={() => setCount(count + 1)}
                    style={{ marginRight: '8px' }}
                  >
                    点击计数: {count}
                  </Button>
                  <Button onClick={() => setCount(0)}>重置</Button>
                </div>
              </div>

              <div>
                <Text strong>用户名 (自动保存):</Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入你的名字..."
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>开关状态 (自动保存):</Text>
                <div style={{ marginTop: '8px' }}>
                  <Switch
                    checked={isEnabled}
                    onChange={setIsEnabled}
                  />
                  <Text style={{ marginLeft: '8px' }}>
                    {isEnabled ? '已启用' : '已禁用'}
                  </Text>
                </div>
              </div>

              <div>
                <Text strong>备注 (自动保存):</Text>
                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="写点什么..."
                  rows={3}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* 表单状态演示 */}
        <Col span={12}>
          <Card title="📝 表单状态演示（useFormState）">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>邮箱:</Text>
                <Input
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>手机:</Text>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="手机号码"
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>地址:</Text>
                <TextArea
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="详细地址"
                  rows={2}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>偏好设置:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space direction="vertical">
                    <div>
                      <Switch
                        checked={formData.preferences?.newsletter}
                        onChange={(checked) => updateField('preferences', {
                          ...formData.preferences,
                          newsletter: checked
                        })}
                        size="small"
                      />
                      <Text style={{ marginLeft: '8px' }}>接收邮件通知</Text>
                    </div>
                    <div>
                      <Switch
                        checked={formData.preferences?.notifications}
                        onChange={(checked) => updateField('preferences', {
                          ...formData.preferences,
                          notifications: checked
                        })}
                        size="small"
                      />
                      <Text style={{ marginLeft: '8px' }}>系统通知</Text>
                    </div>
                  </Space>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 测试操作 */}
        <Col span={24}>
          <Card title="🎮 测试操作">
            <Alert
              message="测试步骤"
              description={
                <ol>
                  <li>填写上面的表单内容</li>
                  <li>点击计数器按钮</li>
                  <li>切换到其他页面（如仪表板）</li>
                  <li>返回此页面查看状态是否保持</li>
                  <li>刷新浏览器，状态仍然保持！</li>
                </ol>
              }
              type="success"
              style={{ marginBottom: '16px' }}
            />
            
            <Space>
              <Button 
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={clearPageState}
              >
                清除当前页面状态
              </Button>
              
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={clearAllAutoStates}
              >
                清除所有自动状态
              </Button>
              
              <Button 
                icon={<ReloadOutlined />}
                onClick={resetForm}
              >
                重置表单
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
              >
                刷新页面测试
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 代码示例 */}
        <Col span={24}>
          <Card title="💻 代码示例">
            <Alert
              message="使用方法"
              description={
                <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`// 路由配置 - 只需要这一行！
meta: {
  keepAlive: true  // ← 自动状态持久化
}

// 组件中 - 将 useState 替换为 useAutoState
import { useAutoState, useFormState } from '@/hooks/useAutoKeepAlive'

function MyPage() {
  // 自动持久化的状态
  const [count, setCount] = useAutoState(0, 'counter')
  const [name, setName] = useAutoState('', 'userName')
  
  // 自动持久化的表单
  const { formData, updateField } = useFormState({
    email: '',
    phone: ''
  })
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        计数: {count}
      </button>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
    </div>
  )
}`}
                </pre>
              }
              type="info"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AutoKeepAliveDemo

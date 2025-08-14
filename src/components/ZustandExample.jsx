import React from 'react'
import { Card, Button, Space, Typography, Tag, Divider } from 'antd'
import { useKeepAliveTestCombined, useTestData, useCounter } from '../store/zustand/hooks'

const { Title, Text, Paragraph } = Typography

/**
 * Zustand 使用示例组件
 * 展示各种状态管理功能和使用方式
 */
const ZustandExample = () => {
  // 方式1：使用组合 Hook（推荐）
  const combined = useKeepAliveTestCombined()
  
  // 方式2：使用特定状态 Hook
  const testData = useTestData()
  const counter = useCounter()
  
  // 方式3：使用完整状态 Hook
  const fullState = useKeepAliveTestCombined()

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Zustand 状态管理示例</Title>
      
      <Paragraph>
        这个组件展示了 Zustand 的多种使用方式，包括组合 Hook、特定状态 Hook 等。
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 组合 Hook 使用示例 */}
        <Card title="组合 Hook 使用 (推荐)" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>计数器: </Text>
              <Tag color="blue">{combined.testData.counter}</Tag>
              <Button size="small" onClick={combined.incrementCounter}>
                增加
              </Button>
            </div>
            
            <div>
              <Text strong>输入内容: </Text>
              <Tag color={combined.testData.inputValue ? 'green' : 'red'}>
                {combined.testData.inputValue || '无'}
              </Tag>
            </div>
            
            <div>
              <Text strong>数据摘要: </Text>
              <div style={{ marginTop: '8px' }}>
                <Tag color="blue">计数器: {combined.dataSummary.counter}</Tag>
                <Tag color="green">点击: {combined.dataSummary.clicks}</Tag>
                <Tag color="orange">随机数: {combined.dataSummary.randomNumber}</Tag>
                <Tag color={combined.dataSummary.hasInput ? 'green' : 'red'}>
                  输入: {combined.dataSummary.hasInput ? '有' : '无'}
                </Tag>
              </div>
            </div>
            
            <div>
              <Text strong>是否为空: </Text>
              <Tag color={combined.isDataEmpty ? 'red' : 'green'}>
                {combined.isDataEmpty ? '是' : '否'}
              </Tag>
            </div>
          </Space>
        </Card>

        {/* 特定状态 Hook 使用示例 */}
        <Card title="特定状态 Hook 使用" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>测试数据: </Text>
              <Text code>{JSON.stringify(testData, null, 2)}</Text>
            </div>
            
            <div>
              <Text strong>计数器值: </Text>
              <Tag color="blue">{counter}</Tag>
            </div>
          </Space>
        </Card>

        {/* 完整状态使用示例 */}
        <Card title="完整状态使用" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>页面加载次数: </Text>
              <Tag color="green">{fullState.pageLoads}</Tag>
            </div>
            
            <div>
              <Text strong>最后访问: </Text>
              <Text code>
                {fullState.lastVisit ? new Date(fullState.lastVisit).toLocaleString() : '未知'}
              </Text>
            </div>
            
            <div>
              <Text strong>KeepAlive 状态: </Text>
              <Tag color={fullState.keepAliveStatus === '已缓存' ? 'green' : 'red'}>
                {fullState.keepAliveStatus}
              </Text>
            </div>
          </Space>
        </Card>

        {/* 操作按钮 */}
        <Card title="操作演示" size="small">
          <Space wrap>
            <Button onClick={combined.resetData} type="primary">
              重置数据
            </Button>
            <Button onClick={combined.generateNewRandomNumber} type="default">
              生成新随机数
            </Button>
            <Button onClick={combined.resetAllData} danger>
              重置所有数据
            </Button>
          </Space>
        </Card>

        {/* 性能说明 */}
        <Card title="性能特性" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>自动优化: </Text>
              <Tag color="green">Zustand 自动优化重渲染</Tag>
            </div>
            
            <div>
              <Text strong>状态订阅: </Text>
              <Tag color="blue">只有订阅的状态变化才会触发重渲染</Tag>
            </div>
            
            <div>
              <Text strong>持久化: </Text>
              <Tag color="orange">状态自动保存到 localStorage</Tag>
            </div>
            
            <div>
              <Text strong>开发调试: </Text>
              <Tag color="purple">可通过 window.__zustandStores 访问</Tag>
            </div>
          </Space>
        </Card>

        {/* 使用建议 */}
        <Card title="使用建议" size="small">
          <Paragraph>
            <Text strong>推荐使用方式：</Text>
          </Paragraph>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>1. 组合 Hook: </Text>
              <Text code>useKeepAliveTestCombined()</Text>
              <Text type="secondary"> - 适用于需要完整功能的组件</Text>
            </div>
            
            <div>
              <Text strong>2. 特定状态 Hook: </Text>
              <Text code>useTestData()</Text>
              <Text type="secondary"> - 适用于只需要特定状态的组件</Text>
            </div>
            
            <div>
              <Text strong>3. 选择器 Hook: </Text>
              <Text code>useTestDataSelector()</Text>
              <Text type="secondary"> - 适用于需要自定义选择器的场景</Text>
            </div>
          </Space>
          
          <Divider />
          
          <Paragraph>
            <Text type="secondary">
              提示：Zustand 会自动处理状态更新和组件重渲染，无需手动优化。
              在开发环境下，可以通过控制台查看状态变化和性能指标。
            </Text>
          </Paragraph>
        </Card>
      </Space>
    </div>
  )
}

export default ZustandExample

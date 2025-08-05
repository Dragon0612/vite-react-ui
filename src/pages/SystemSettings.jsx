import React from 'react'
import { Card, Form, Input, Button, Switch, Select, Row, Col, Divider } from 'antd'

const { Option } = Select

const SystemSettings = () => {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log('系统设置:', values)
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>系统设置</h2>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: '后台管理系统',
            siteDescription: '一个现代化的后台管理系统',
            enableRegistration: true,
            enableEmailNotification: true,
            timezone: 'Asia/Shanghai',
            language: 'zh-CN'
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="siteName"
                label="网站名称"
                rules={[{ required: true, message: '请输入网站名称' }]}
              >
                <Input placeholder="请输入网站名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="siteDescription"
                label="网站描述"
              >
                <Input placeholder="请输入网站描述" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="timezone"
                label="时区设置"
              >
                <Select placeholder="请选择时区">
                  <Option value="Asia/Shanghai">Asia/Shanghai</Option>
                  <Option value="UTC">UTC</Option>
                  <Option value="America/New_York">America/New_York</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="语言设置"
              >
                <Select placeholder="请选择语言">
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>功能设置</Divider>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="enableRegistration"
                label="允许用户注册"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enableEmailNotification"
                label="启用邮件通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="enableSMS"
                label="启用短信通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enableBackup"
                label="自动备份"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SystemSettings 
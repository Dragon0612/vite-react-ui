import React, { useState } from 'react'
import { Form, Input, Button, message, Modal, Typography } from 'antd'
import { MailOutlined } from '@ant-design/icons'

const { Text } = Typography

const ForgotPassword = ({ visible, onCancel }) => {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      console.log('忘记密码信息:', values)
      // 模拟发送重置密码邮件
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('重置密码邮件已发送，请检查您的邮箱')
      handleCancel()
    } catch (error) {
      message.error('发送失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="重置密码"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Text type="secondary">
          请输入您的邮箱地址，我们将向您发送重置密码的链接
        </Text>
      </div>
      
      <Form
        form={form}
        name="forgotPassword"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="邮箱地址" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
            loading={isLoading}
          >
            发送重置链接
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ForgotPassword

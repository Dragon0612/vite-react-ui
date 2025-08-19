import React, { useState } from 'react'
import { Card, Form, Input, Button, Checkbox, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/zustand'
import { loginToApifox } from '@/services/api/services/ApifoxAuthService'
import ForgotPassword from './ForgotPassword'

const { Link } = Typography

const Login = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 使用Zustand状态管理
  const { login } = useUserStore()

  const onFinish = async (values) => {
    console.log('登录信息:', values)
    setLoading(true)
    
    try {
      // 使用Apifox登录接口
      const result = await loginToApifox({
        username: values.username,
        password: values.password,
        rememberMe: values.remember || false
      })
      
      // 处理登录成功
      if (result.success && result.data) {
        // 保存token到本地存储
        if (result.data.token) {
          localStorage.setItem('token', result.data.token)
        }
        if (result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user))
        }
        
        // 使用Zustand登录状态管理
        login(result.data)
        
        message.success('登录成功')
        navigate('/')
      } else {
        message.error('登录失败，请重试')
      }
    } catch (error) {
      console.error('登录异常:', error)
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setIsForgotPasswordVisible(true)
  }

  const handleForgotPasswordCancel = () => {
    setIsForgotPasswordVisible(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#1890ff', marginBottom: '8px' }}>后台管理系统</h2>
          <p style={{ color: '#666' }}>请登录您的账户</p>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link 
                type="primary" 
                onClick={handleForgotPassword}
                style={{ fontSize: '14px' }}
              >
                忘记密码？
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 忘记密码组件 */}
      <ForgotPassword 
        visible={isForgotPasswordVisible}
        onCancel={handleForgotPasswordCancel}
      />
    </div>
  )
}

export default Login

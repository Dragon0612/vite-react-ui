import React, { useState } from 'react'
import { Button, Card, Space, message, Form, Input, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useRequest } from '@/hooks/useRequest'
import { userService, productService } from '@/services'
import { get, post, put, del, upload, download, all, race } from '@/utils/request'

function RequestDemo() {
  const [form] = Form.useForm()

  // 示例1：基础请求
  const handleBasicRequest = async () => {
    try {
      // GET 请求
      const users = await get('/users', { page: 1, limit: 10 })
      console.log('用户列表:', users)

      // POST 请求
      const newUser = await post('/users', {
        name: '张三',
        email: 'zhangsan@example.com'
      })
      console.log('创建用户:', newUser)

      message.success('基础请求成功')
    } catch (error) {
      message.error('请求失败')
    }
  }

  // 示例2：使用服务层
  const { data: userProfile, loading: profileLoading, refetch: refetchProfile } = useRequest(
    userService.getProfile,
    {
      onSuccess: (data) => {
        console.log('用户信息:', data)
      }
    }
  )

  // 示例3：文件上传
  const handleUpload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const result = await upload('/upload', formData)
      message.success('上传成功')
      console.log('上传结果:', result)
    } catch (error) {
      message.error('上传失败')
    }
  }

  // 示例4：文件下载
  const handleDownload = async () => {
    try {
      await download('/export/users', {}, 'users.xlsx')
      message.success('下载成功')
    } catch (error) {
      message.error('下载失败')
    }
  }

  // 示例5：并发请求
  const handleConcurrentRequests = async () => {
    try {
      const [users, products] = await all([
        get('/users'),
        get('/products')
      ])
      console.log('并发请求结果:', { users, products })
      message.success('并发请求成功')
    } catch (error) {
      message.error('并发请求失败')
    }
  }

  // 示例6：竞态请求
  const handleRaceRequest = async () => {
    try {
      const result = await race([
        get('/api/slow'),
        get('/api/fast')
      ])
      console.log('竞态请求结果:', result)
      message.success('竞态请求成功')
    } catch (error) {
      message.error('竞态请求失败')
    }
  }

  return (
    <div className="container">
      <h1 className="text-primary mb-4">请求函数使用示例</h1>

      {/* 基础请求示例 */}
      <Card title="基础请求" className="mb-4">
        <Space>
          <Button onClick={handleBasicRequest}>
            基础 GET/POST 请求
          </Button>
          <Button onClick={handleDownload}>
            文件下载
          </Button>
          <Button onClick={handleConcurrentRequests}>
            并发请求
          </Button>
          <Button onClick={handleRaceRequest}>
            竞态请求
          </Button>
        </Space>
      </Card>

      {/* 自定义 Hook 示例 */}
      <Card title="自定义 Hook 使用" className="mb-4">
        <div className="mb-3">
          <strong>用户信息:</strong>
          {profileLoading ? (
            <span className="ml-2">加载中...</span>
          ) : (
            <div className="ml-2">
              {userProfile ? (
                <span>欢迎, {userProfile.name}!</span>
              ) : (
                <span>未登录</span>
              )}
            </div>
          )}
        </div>
        <Button onClick={refetchProfile}>
          刷新用户信息
        </Button>
      </Card>

      {/* 文件上传示例 */}
      <Card title="文件上传" className="mb-4">
        <Upload
          beforeUpload={(file) => {
            handleUpload(file)
            return false // 阻止自动上传
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>
            选择文件上传
          </Button>
        </Upload>
      </Card>

      {/* 表单提交示例 */}
      <Card title="表单提交" className="mb-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const result = await post('/users', values)
              message.success('提交成功')
              console.log('提交结果:', result)
              form.resetFields()
            } catch (error) {
              message.error('提交失败')
            }
          }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 错误处理示例 */}
      <Card title="错误处理" className="mb-4">
        <Space>
          <Button 
            onClick={() => get('/api/not-exist')}
            danger
          >
            触发 404 错误
          </Button>
          <Button 
            onClick={() => get('/api/unauthorized')}
            danger
          >
            触发 401 错误
          </Button>
          <Button 
            onClick={() => get('/api/server-error')}
            danger
          >
            触发 500 错误
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default RequestDemo 
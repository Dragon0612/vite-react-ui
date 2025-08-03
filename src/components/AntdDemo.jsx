import React, { useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Radio,
  Checkbox,
  Slider,
  Rate,
  Upload,
  Table,
  Tag,
  Progress,
  Alert,
  Modal,
  message,
  notification,
  Space,
  Row,
  Col,
  Typography,
  Divider
} from 'antd'
import {
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input

const AntdDemo = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  // 表格数据
  const tableData = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
      tags: ['开发', 'React']
    },
    {
      key: '2',
      name: '李四',
      age: 28,
      address: '上海市浦东新区',
      tags: ['设计', 'UI']
    },
    {
      key: '3',
      name: '王五',
      age: 35,
      address: '广州市天河区',
      tags: ['测试', 'QA']
    }
  ]

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )
    }
  ]

  const onFinish = (values) => {
    setLoading(true)
    setTimeout(() => {
      message.success('表单提交成功！')
      console.log('表单数据:', values)
      setLoading(false)
      form.resetFields()
    }, 1000)
  }

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    setVisible(false)
    notification.success({
      message: '操作成功',
      description: '这是一个成功通知的示例'
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div className="p-6">
      <Title level={2}>Ant Design 组件演示</Title>
      <Paragraph>这个页面展示了 Ant Design 4.x 的常用组件</Paragraph>

      <Row gutter={[16, 16]}>
        {/* 表单组件 */}
        <Col xs={24} lg={12}>
          <Card title="表单组件" className="mb-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                gender: 'male',
                remember: true,
                rate: 4
              }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名！' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱！' },
                  { type: 'email', message: '请输入有效的邮箱地址！' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号！' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
              </Form.Item>

              <Form.Item name="gender" label="性别">
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="interests" label="兴趣爱好">
                <Checkbox.Group>
                  <Checkbox value="reading">阅读</Checkbox>
                  <Checkbox value="music">音乐</Checkbox>
                  <Checkbox value="sports">运动</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="city" label="城市">
                <Select placeholder="请选择城市">
                  <Option value="beijing">北京</Option>
                  <Option value="shanghai">上海</Option>
                  <Option value="guangzhou">广州</Option>
                  <Option value="shenzhen">深圳</Option>
                </Select>
              </Form.Item>

              <Form.Item name="birthday" label="生日">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="description" label="个人描述">
                <TextArea rows={4} placeholder="请输入个人描述" />
              </Form.Item>

              <Form.Item name="rate" label="评分">
                <Rate />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>记住我</Checkbox>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 其他组件 */}
        <Col xs={24} lg={12}>
          <Card title="其他组件" className="mb-4">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Paragraph>按钮类型：</Paragraph>
                <Space>
                  <Button type="primary">主要按钮</Button>
                  <Button>默认按钮</Button>
                  <Button type="dashed">虚线按钮</Button>
                  <Button type="text">文本按钮</Button>
                  <Button type="link">链接按钮</Button>
                </Space>
              </div>

              <div>
                <Paragraph>开关组件：</Paragraph>
                <Switch defaultChecked />
              </div>

              <div>
                <Paragraph>滑块组件：</Paragraph>
                <Slider defaultValue={30} />
              </div>

              <div>
                <Paragraph>上传组件：</Paragraph>
                <Upload>
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
              </div>

              <div>
                <Paragraph>进度条：</Paragraph>
                <Progress percent={70} />
              </div>

              <div>
                <Paragraph>标签：</Paragraph>
                <Space>
                  <Tag color="blue">蓝色</Tag>
                  <Tag color="green">绿色</Tag>
                  <Tag color="orange">橙色</Tag>
                  <Tag color="red">红色</Tag>
                </Space>
              </div>

              <div>
                <Paragraph>警告提示：</Paragraph>
                <Alert
                  message="这是一个警告提示"
                  description="这是警告提示的详细描述"
                  type="warning"
                  showIcon
                />
              </div>

              <div>
                <Button type="primary" onClick={showModal}>
                  打开模态框
                </Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 表格组件 */}
      <Card title="表格组件" className="mb-4">
        <Table columns={columns} dataSource={tableData} />
      </Card>

      {/* 模态框 */}
      <Modal
        title="模态框示例"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>这是一个模态框的示例内容。</p>
        <p>您可以在这里放置任何内容。</p>
      </Modal>
    </div>
  )
}

export default AntdDemo 
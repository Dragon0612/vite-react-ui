# Ant Design 4.x 集成说明

本项目已成功集成 Ant Design 4.x 版本，以下是详细的使用说明。

## 安装的依赖

- `antd@^4.24.0` - Ant Design 4.x 核心库
- `vite-plugin-style-import@^2.0.0` - Vite 按需加载插件
- `less@^4.4.0` - Less 预处理器（Ant Design 样式依赖）
- `consola@^3.4.2` - 控制台日志工具

## 配置说明

### 1. Vite 配置 (vite.config.js)

已配置按需加载和 Less 支持，减少打包体积并支持主题定制：

```javascript
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'

export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [AntdResolve()],
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name) => `antd/es/${name}/style/index`
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1890ff',
          'link-color': '#1890ff',
          'success-color': '#52c41a',
          'warning-color': '#faad14',
          'error-color': '#f5222d',
          'font-size-base': '14px',
          'heading-color': 'rgba(0, 0, 0, 0.85)',
          'text-color': 'rgba(0, 0, 0, 0.65)',
          'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
          'disabled-color': 'rgba(0, 0, 0, 0.25)',
          'border-radius-base': '6px',
          'border-color-base': '#d9d9d9',
          'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
        }
      }
    }
  }
})
```

### 2. 应用配置 (App.jsx)

已配置中文语言包和主题：

```javascript
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      {/* 应用内容 */}
    </ConfigProvider>
  )
}
```

## 使用方法

### 1. 导入组件

```javascript
import { Button, Card, Form, Input, Select } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
```

### 2. 使用组件

```javascript
function MyComponent() {
  return (
    <Card title="表单示例">
      <Form layout="vertical">
        <Form.Item label="用户名" name="username">
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
```

## 项目结构

```
src/
├── components/
│   └── AntdDemo.jsx          # Ant Design 组件演示
├── pages/
│   ├── Home.jsx              # 首页（已集成 Ant Design）
│   └── About.jsx             # 关于页面（已集成 Ant Design）
└── App.jsx                   # 应用入口（已配置 ConfigProvider）
```

## 可用页面

1. **首页** (`/`) - 展示项目特性和快速开始指南
2. **关于页面** (`/about`) - 展示技术栈和项目结构
3. **Ant Design 演示** (`/demo`) - 完整的组件使用示例

## 常用组件示例

### 按钮组件

```javascript
import { Button, Space } from 'antd'

<Space>
  <Button type="primary">主要按钮</Button>
  <Button>默认按钮</Button>
  <Button type="dashed">虚线按钮</Button>
  <Button type="text">文本按钮</Button>
</Space>
```

### 表单组件

```javascript
import { Form, Input, Select, Button } from 'antd'

<Form layout="vertical" onFinish={onFinish}>
  <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
    <Input placeholder="请输入用户名" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">提交</Button>
  </Form.Item>
</Form>
```

### 表格组件

```javascript
import { Table } from 'antd'

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' }
]

const data = [
  { key: '1', name: '张三', age: 32 },
  { key: '2', name: '李四', age: 28 }
]

<Table columns={columns} dataSource={data} />
```

### 消息提示

```javascript
import { message, notification } from 'antd'

// 消息提示
message.success('操作成功！')
message.error('操作失败！')
message.warning('警告信息！')

// 通知提示
notification.success({
  message: '成功',
  description: '操作已完成'
})
```

## 主题定制

### 1. 通过 Vite 配置进行全局主题定制

在 `vite.config.js` 中已配置了 Less 变量，可以修改 `modifyVars` 来自定义主题：

```javascript
css: {
  preprocessorOptions: {
    less: {
      javascriptEnabled: true,
      modifyVars: {
        'primary-color': '#1890ff',        // 主色调
        'link-color': '#1890ff',          // 链接色
        'success-color': '#52c41a',       // 成功色
        'warning-color': '#faad14',       // 警告色
        'error-color': '#f5222d',         // 错误色
        'font-size-base': '14px',         // 基础字体大小
        'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
        'text-color': 'rgba(0, 0, 0, 0.65)',    // 主文本色
        'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
        'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
        'border-radius-base': '6px',      // 基础圆角
        'border-color-base': '#d9d9d9',  // 基础边框色
        'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' // 基础阴影
      }
    }
  }
}
```

### 2. 通过 ConfigProvider 进行运行时主题定制

```javascript
import { ConfigProvider } from 'antd'

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
  {/* 应用内容 */}
</ConfigProvider>
```

## 图标使用

Ant Design 提供了丰富的图标库：

```javascript
import { 
  UserOutlined, 
  LockOutlined, 
  HomeOutlined,
  HeartOutlined,
  StarOutlined 
} from '@ant-design/icons'

// 在组件中使用
<Button icon={<UserOutlined />}>用户</Button>
```

## 开发建议

1. **按需导入**：只导入需要的组件，减少打包体积
2. **使用 TypeScript**：建议使用 TypeScript 获得更好的类型提示
3. **响应式设计**：使用 Ant Design 的栅格系统进行响应式布局
4. **表单验证**：充分利用 Form 组件的验证功能
5. **国际化**：使用 ConfigProvider 的 locale 属性进行国际化

## 相关链接

- [Ant Design 官方文档](https://ant.design/docs/react/introduce-cn)
- [Ant Design 组件库](https://ant.design/components/overview/)
- [Ant Design 图标库](https://ant.design/components/icon-cn/)
- [Vite 官方文档](https://vitejs.dev/)

## 启动项目

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 预览构建结果
yarn preview
```

访问 `http://localhost:5173` 查看项目效果。

## 故障排除

### 1. Less 预处理器错误

如果遇到 `Preprocessor dependency "less" not found` 错误，请确保已安装 Less：

```bash
yarn add -D less
```

### 2. 样式不生效

确保 `vite.config.js` 中已正确配置 Less 支持：

```javascript
css: {
  preprocessorOptions: {
    less: {
      javascriptEnabled: true,
      // 其他配置...
    }
  }
}
```

### 3. 按需加载不生效

检查 `vite-plugin-style-import` 配置是否正确，确保已安装相关依赖：

```bash
yarn add -D vite-plugin-style-import consola
```

### 4. 图标不显示

确保已正确导入图标：

```javascript
import { UserOutlined, LockOutlined } from '@ant-design/icons'
```

### 5. 中文语言包不生效

确保已正确导入和配置中文语言包：

```javascript
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

<ConfigProvider locale={zhCN}>
  {/* 应用内容 */}
</ConfigProvider>
``` 
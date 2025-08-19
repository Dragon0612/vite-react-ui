# 登录API设置指南

## 📋 概述

当前登录页面已配置为请求真实的API接口。为了让登录功能正常工作，您需要启动后端API服务。

## 🔧 API配置

### 当前配置
- **API基础URL**: `http://localhost:8080`
- **登录接口**: `POST /auth/login`
- **环境变量**: `VITE_API_BASE_URL`

### 修改API地址
如果您的后端API运行在不同的地址，请：

1. 创建 `.env.development` 文件：
```bash
VITE_API_BASE_URL=http://localhost:3001  # 修改为您的API地址
```

2. 或者直接修改 `src/api/login.js` 中的默认URL：
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://您的API地址'
```

## 🚀 后端API要求

您的后端服务需要提供以下接口：

### 1. 登录接口
```
POST /auth/login
Content-Type: application/json

请求体:
{
  "username": "用户名或邮箱",
  "password": "密码",
  "rememberMe": true/false
}

成功响应:
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  },
  "message": "登录成功"
}

失败响应:
{
  "success": false,
  "message": "用户名或密码错误"
}
```

### 2. 健康检查接口（可选）
```
GET /health

响应:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🧪 测试功能

登录页面提供了以下测试功能：

1. **API连接检测**: 自动检查API服务是否可访问
2. **重新检测按钮**: 手动重新检查API连接
3. **测试登录接口按钮**: 使用测试数据调用登录接口
4. **详细错误日志**: 在浏览器控制台查看详细的请求和响应信息

## 🔍 调试步骤

如果登录失败，请按以下步骤排查：

### 1. 检查API服务
- 确认后端API服务已启动
- 访问 `http://localhost:8080/health` 检查服务状态
- 检查控制台是否有CORS错误

### 2. 检查网络请求
1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 尝试登录，观察网络请求
4. 检查请求状态码和响应内容

### 3. 查看详细日志
1. 打开浏览器控制台（F12 -> Console）
2. 点击 "测试登录接口" 按钮
3. 查看详细的请求和响应日志

### 4. 常见错误解决

#### CORS错误
如果出现跨域错误，请在后端添加CORS配置：
```javascript
// Express.js示例
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

#### 网络连接失败
- 检查API服务是否在正确端口启动
- 确认防火墙没有阻止连接
- 尝试直接访问API地址

#### 接口不存在 (404)
- 确认后端路由配置正确
- 检查接口路径是否匹配

## 📝 快速启动示例

如果您需要一个简单的测试API服务，可以使用以下Node.js代码：

```javascript
// server.js
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 登录接口
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body
  
  // 简单的验证逻辑
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        token: 'fake-jwt-token-' + Date.now(),
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      },
      message: '登录成功'
    })
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    })
  }
})

app.listen(8080, () => {
  console.log('测试API服务启动在端口 8080')
})
```

运行测试服务：
```bash
npm install express cors
node server.js
```

## 🎯 测试账号

使用上述测试服务时，可以使用以下账号登录：
- **用户名**: admin
- **密码**: admin123

## 💡 提示

1. 登录页面会显示当前的API地址和连接状态
2. 如果API连接失败，会显示橙色警告信息
3. 点击"测试登录接口"按钮可以快速验证接口是否正常
4. 所有的请求和响应信息都会在控制台中详细记录

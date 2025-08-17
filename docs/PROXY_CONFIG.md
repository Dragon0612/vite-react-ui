# Vite 代理配置指南

## 📋 概述

Vite 开发服务器提供了简洁的代理功能，用于解决开发环境中的跨域问题。

## 🔧 当前配置

### 开发服务器配置
```javascript
server: {
  port: 3000,           // 开发服务器端口
  open: true,           // 自动打开浏览器
  cors: true,           // 启用CORS
  host: '0.0.0.0',      // 允许外部访问
  proxy: {
    // 统一的 API 代理
    '/api': {
      target: env.VITE_API_BASE_URL || 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 代理配置详解

#### 统一的 API 代理
```javascript
'/api': {
  target: env.VITE_API_BASE_URL || 'http://localhost:8080',  // 后端服务地址
  changeOrigin: true,               // 改变请求头中的 Origin
  secure: false,                    // 支持 HTTP 协议
  rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写
}
```

## 🚀 使用方法

### 前端请求示例
```javascript
// 使用代理的 API 请求
const response = await fetch('/api/users')
const data = await response.json()

// 用户相关请求
const userResponse = await fetch('/api/user/profile')
const userData = await userResponse.json()

// 文件上传
const formData = new FormData()
formData.append('file', file)
const uploadResponse = await fetch('/api/upload/file', {
  method: 'POST',
  body: formData
})
```

### Axios 配置
```javascript
// src/services/api/config.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',  // 使用代理前缀
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
```

## 📊 代理配置选项

| 配置项 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `target` | string | 代理目标地址 | `'http://localhost:8080'` |
| `changeOrigin` | boolean | 是否改变请求头 Origin | `true` |
| `secure` | boolean | 是否验证 SSL 证书 | `false` |
| `rewrite` | function | 路径重写函数 | `(path) => path.replace(/^\/api/, '')` |

## 🎯 最佳实践

### 1. 统一的 API 前缀
- 所有 API 请求都使用 `/api` 前缀
- 后端服务统一处理所有 API 路由
- 简化前端配置和维护

### 2. 环境变量配置
```javascript
// 在 vite.config.js 中使用环境变量
target: env.VITE_API_BASE_URL || 'http://localhost:8080'
```

### 3. 错误处理
```javascript
configure: (proxy, options) => {
  proxy.on('error', (err, req, res) => {
    console.log('❌ 代理错误:', err.message)
  })
}
```

## 🚨 注意事项

- 生产环境不要使用代理
- 注意敏感信息的传输
- 确保目标服务支持 CORS
- 代理只在开发环境生效

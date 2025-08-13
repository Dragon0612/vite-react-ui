# API架构集成指南

## 🎯 概述

本指南将帮助您完成新API管理架构的集成，并展示如何在现有项目中使用这些功能。

## 📁 已创建的文件结构

```
src/services/api/
├── BaseApiService.js          # 基础API服务类
├── HttpClient.js              # HTTP客户端管理器
├── types.js                   # 类型定义
├── config.js                  # 配置管理
├── middleware.js              # 中间件系统
├── index.js                   # 统一入口
├── services/
│   ├── UserService.js         # 用户管理服务
│   └── AuthService.js         # 认证服务
└── test.js                    # 测试文件
```

## 🚀 快速开始

### 1. 基本使用

```javascript
import { userService, authService, httpClient } from '@/services/api'

// 获取用户列表
const users = await userService.getUsers({ page: 1, pageSize: 10 })

// 用户登录
const result = await authService.login({ username: 'admin', password: '123456' })

// 创建自定义服务
const customService = httpClient.createService('custom', 'https://api.example.com')
```

### 2. 中间件使用

```javascript
import { httpClient, loggingMiddleware, cacheMiddleware } from '@/services/api'

// 添加中间件
httpClient.addMiddleware(loggingMiddleware)
httpClient.addMiddleware(cacheMiddleware)

// 创建带中间件的服务
const service = httpClient.createService('api', 'https://api.example.com')
```

### 3. 环境配置

```javascript
import { getEnvConfig, isDevelopment, isProduction } from '@/services/api'

const config = getEnvConfig()
console.log('当前环境:', config.environment)
console.log('API地址:', config.baseURL)
```

## 🔧 集成步骤

### 步骤1: 验证依赖

确保项目已安装必要的依赖：

```bash
npm install axios
```

### 步骤2: 导入API服务

在需要使用API的组件中导入：

```javascript
import { userService, authService, httpClient } from '@/services/api'
```

### 步骤3: 配置环境

根据您的环境修改 `src/services/api/config.js` 中的配置：

```javascript
const ENV_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',  // 修改为您的开发环境API地址
    timeout: 10000,
    // ... 其他配置
  },
  production: {
    baseURL: 'https://your-api-domain.com/api',  // 修改为您的生产环境API地址
    timeout: 15000,
    // ... 其他配置
  }
}
```

### 步骤4: 测试集成

运行测试文件验证架构是否正常：

```javascript
// 在浏览器控制台中运行
import('/src/services/api/test.js')
```

## 📱 演示组件

已创建的 `ApiDemo` 组件展示了以下功能：

- ✅ 用户列表获取和分页
- ✅ 用户统计信息
- ✅ API性能监控
- ✅ 用户创建和删除
- ✅ 认证服务测试
- ✅ 自定义服务创建
- ✅ 缓存功能测试
- ✅ 请求取消功能

## 🎨 自定义扩展

### 创建新的业务服务

```javascript
import { BaseApiService } from '@/services/api/BaseApiService'

export class ProductService extends BaseApiService {
  constructor(baseURL, options = {}) {
    super(baseURL, options)
  }

  async getProducts(params = {}) {
    return await this.get('/products', { params })
  }

  async createProduct(data) {
    return await this.post('/products', data)
  }
}

export const productService = new ProductService()
```

### 添加自定义中间件

```javascript
export const customMiddleware = (service) => {
  const originalGet = service.get
  
  service.get = async function(url, config = {}) {
    // 自定义逻辑
    console.log(`自定义中间件: 请求 ${url}`)
    
    const result = await originalGet.call(this, url, config)
    
    // 自定义后处理
    console.log(`自定义中间件: 响应 ${url}`)
    
    return result
  }
}
```

## 🔍 故障排除

### 常见问题

1. **导入错误**: 检查文件路径是否正确
2. **配置错误**: 验证 `config.js` 中的环境配置
3. **中间件不工作**: 确认中间件已正确添加到HTTP客户端
4. **API请求失败**: 检查网络连接和API地址配置

### 调试技巧

```javascript
// 启用详细日志
import { httpClient } from '@/services/api'
httpClient.addMiddleware(loggingMiddleware)

// 查看配置
console.log('HTTP客户端配置:', httpClient.getConfig())
console.log('已注册中间件:', httpClient.middlewares)
```

## 📚 最佳实践

1. **服务分离**: 为不同的业务领域创建独立的服务类
2. **中间件复用**: 将通用逻辑封装为中间件
3. **错误处理**: 使用统一的错误处理中间件
4. **类型安全**: 利用TypeScript类型定义提高代码质量
5. **性能优化**: 合理使用缓存和重试中间件

## 🎉 完成

恭喜！您已经成功集成了新的API管理架构。现在可以：

- 使用 `userService` 和 `authService` 进行API调用
- 通过 `httpClient` 创建自定义服务
- 利用中间件系统处理通用逻辑
- 在 `ApiDemo` 页面查看功能演示

如有问题，请参考故障排除部分或查看控制台日志。

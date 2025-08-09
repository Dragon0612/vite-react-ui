# API 管理架构

## 概述

这是一个完善的API管理架构，提供了统一的HTTP请求处理、中间件系统、错误处理、缓存、重试等企业级功能。

## 架构特点

### 🏗️ 分层架构
- **BaseApiService**: 基础API服务类，提供统一的HTTP方法
- **HttpClient**: HTTP客户端管理器，负责服务实例的创建和管理
- **中间件系统**: 可插拔的中间件，支持功能扩展
- **业务服务**: 具体的业务逻辑服务实现

### 🔧 核心功能
- ✅ 统一的请求/响应拦截器
- ✅ 自动重试机制
- ✅ 请求缓存
- ✅ 性能监控
- ✅ 认证token管理
- ✅ 错误统一处理
- ✅ 请求取消支持
- ✅ 环境配置管理

## 快速开始

### 1. 基本使用

```javascript
import { userService, authService } from '@/services/api'

// 用户登录
const loginResult = await authService.login({
  username: 'admin',
  password: '123456'
})

// 获取用户列表
const users = await userService.getUsers({
  page: 1,
  pageSize: 10,
  keyword: 'admin'
})
```

### 2. 创建自定义服务

```javascript
import { BaseApiService } from '@/services/api'

class ProductService extends BaseApiService {
  constructor(baseURL, options = {}) {
    super(baseURL, options)
  }

  async getProducts(params = {}) {
    return this.get('/products', { params })
  }

  async createProduct(data) {
    return this.post('/products', data)
  }
}

const productService = new ProductService()
```

### 3. 使用HTTP客户端

```javascript
import { httpClient } from '@/services/api'

// 创建服务实例
const customService = httpClient.createService('custom', 'https://api.example.com', {
  timeout: 15000,
  retryTimes: 5
})

// 使用服务
const result = await customService.get('/data')
```

## 中间件系统

### 内置中间件

#### 1. 日志中间件 (loggingMiddleware)
记录所有API请求和响应，便于调试和监控。

#### 2. 缓存中间件 (cacheMiddleware)
为GET请求添加缓存功能，提高性能。

```javascript
// 启用缓存
const result = await service.get('/users', { cache: true })

// 清除缓存
service.clearCache()
service.clearCache('users') // 清除特定模式的缓存
```

#### 3. 重试中间件 (retryMiddleware)
自动重试失败的请求，提高成功率。

#### 4. 性能监控中间件 (performanceMiddleware)
监控API请求性能，识别慢请求。

```javascript
// 获取性能指标
const metrics = service.getMetrics()
console.log('平均响应时间:', metrics.averageResponseTime)
```

#### 5. 认证中间件 (authMiddleware)
自动处理token刷新和认证失败。

#### 6. 错误处理中间件 (errorHandlingMiddleware)
统一处理API错误，显示友好的错误提示。

#### 7. 请求取消中间件 (cancelRequestMiddleware)
支持请求取消功能，避免无效请求。

```javascript
// 取消特定请求
const cancelToken = 'cancel_123'
service.cancelRequest(cancelToken)

// 取消所有请求
service.cancelAllRequests()
```

### 自定义中间件

```javascript
const customMiddleware = (service) => {
  const originalGet = service.get
  
  service.get = async function(url, config = {}) {
    // 自定义逻辑
    console.log('自定义中间件处理:', url)
    
    // 调用原始方法
    return originalGet.call(this, url, config)
  }
}

// 添加到HTTP客户端
httpClient.addMiddleware(customMiddleware)
```

## 配置管理

### 环境配置

```javascript
import { getEnvConfig, isDevelopment, isProduction } from '@/services/api'

const config = getEnvConfig()
console.log('当前环境:', config.baseURL)

if (isDevelopment()) {
  console.log('开发环境')
}
```

### 自定义配置

```javascript
import { httpClient } from '@/services/api'

// 设置全局配置
httpClient.setConfig({
  timeout: 20000,
  retryTimes: 5
})

// 获取当前配置
const currentConfig = httpClient.getConfig()
```

## 错误处理

### 错误类型

```javascript
import { ErrorType, ApiError } from '@/services/api'

// 检查错误类型
if (error.type === ErrorType.AUTH) {
  // 处理认证错误
} else if (error.type === ErrorType.NETWORK) {
  // 处理网络错误
}
```

### 自定义错误处理

```javascript
import { errorHandlingMiddleware } from '@/services/api'

const customErrorHandler = (service) => {
  const originalRequest = service.api.request
  
  service.api.request = async function(config) {
    try {
      return await originalRequest.call(this, config)
    } catch (error) {
      // 自定义错误处理逻辑
      if (error.response?.status === 429) {
        console.log('请求频率过高，请稍后重试')
      }
      throw error
    }
  }
}

httpClient.addMiddleware(customErrorHandler)
```

## 类型定义

### 响应类型

```javascript
import { ApiResponse, PaginatedResponse } from '@/services/api'

// 标准响应
const response = new ApiResponse(data, 200, 'success')

// 分页响应
const paginatedResponse = new PaginatedResponse(list, total, page, pageSize)
```

### 请求参数

```javascript
import { PaginationParams } from '@/services/api'

const params = new PaginationParams(1, 20, 'createdAt', 'desc')
const queryString = params.toQueryString()
```

## 最佳实践

### 1. 服务组织
- 按业务模块组织服务
- 每个服务继承BaseApiService
- 使用统一的端点配置

### 2. 错误处理
- 在中间件中统一处理常见错误
- 在业务代码中处理业务逻辑错误
- 提供用户友好的错误提示

### 3. 性能优化
- 合理使用缓存
- 设置适当的超时时间
- 监控慢请求

### 4. 安全性
- 使用HTTPS
- 实现token刷新机制
- 验证用户权限

## 扩展功能

### 添加新的中间件

```javascript
export const newMiddleware = (service, options = {}) => {
  // 中间件实现
}

// 注册中间件
httpClient.addMiddleware(newMiddleware)
```

### 添加新的业务服务

```javascript
export class NewService extends BaseApiService {
  // 服务实现
}

// 导出服务实例
export const newService = new NewService()
```

## 故障排除

### 常见问题

1. **请求超时**
   - 检查网络连接
   - 调整超时配置
   - 检查服务器状态

2. **认证失败**
   - 检查token是否有效
   - 确认token刷新机制
   - 验证用户权限

3. **缓存问题**
   - 检查缓存配置
   - 手动清除缓存
   - 验证缓存键值

### 调试技巧

```javascript
// 启用详细日志
if (isDevelopment()) {
  httpClient.addMiddleware(loggingMiddleware)
}

// 查看性能指标
const metrics = service.getMetrics()
console.table(metrics)
```

## 更新日志

### v1.0.0
- 初始版本发布
- 基础API服务架构
- 中间件系统
- 错误处理机制

### v1.1.0
- 添加缓存中间件
- 性能监控功能
- 请求取消支持
- 完善类型定义

## 贡献指南

欢迎提交Issue和Pull Request来改进这个架构。

## 许可证

MIT License

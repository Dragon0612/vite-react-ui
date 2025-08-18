/**
 * API服务统一入口
 * 导出所有API相关的服务和配置
 */

// 核心服务
export { BaseApiService } from './BaseApiService'
export { HttpClient, httpClient } from './HttpClient'

// 类型定义
export {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  FileUploadResponse,
  ErrorType,
  ApiError,
  RequestConfig,
  StatusCode
} from './types'

// 配置 - 使用简化的配置
export {
  API_ENDPOINTS,
  RESPONSE_CODES,
  ERROR_MESSAGES,
  apiService
} from './config'

// 默认API实例
export { default as api } from './config'

// 中间件
export {
  loggingMiddleware,
  cacheMiddleware,
  retryMiddleware,
  performanceMiddleware,
  authMiddleware,
  errorHandlingMiddleware,
  cancelRequestMiddleware
} from './middleware'

// 业务服务
export { UserService, userService } from './services/UserService'
export { AuthService, authService } from './services/AuthService'

// Apifox 增强服务
export { ApifoxUserService, apifoxUserService, testApifoxIntegration } from './services/ApifoxUserService'
export { ApifoxAuthService, apifoxAuthService, loginToApifox, testApifoxLogin } from './services/ApifoxAuthService'

// Apifox 配置和工具
export { 
  APIFOX_CONFIG, 
  APIFOX_PROJECT_INFO,
  createSmartApiCall,
  createApifoxApi,
  isApifoxEnabled,
  getApifoxProjectUrl,
  getApifoxMockUrl 
} from './apifox.config'

// 创建并配置HTTP客户端
import { httpClient } from './HttpClient'
import {
  loggingMiddleware,
  cacheMiddleware,
  retryMiddleware,
  performanceMiddleware,
  authMiddleware,
  errorHandlingMiddleware,
  cancelRequestMiddleware
} from './middleware'

// 配置HTTP客户端 - 使用简化的配置
httpClient.setConfig({
  baseURL: '/api',  // 使用统一的代理前缀
  timeout: import.meta.env.DEV ? 10000 : 5000,
  retryTimes: 3,
  retryDelay: 1000
})

// 添加中间件 - 根据环境配置
if (import.meta.env.DEV) {
  // 开发环境启用所有中间件
  httpClient.addMiddleware(loggingMiddleware)
  httpClient.addMiddleware(cacheMiddleware)
  httpClient.addMiddleware(retryMiddleware)
  httpClient.addMiddleware(performanceMiddleware)
  httpClient.addMiddleware(authMiddleware)
  httpClient.addMiddleware(errorHandlingMiddleware)
  httpClient.addMiddleware(cancelRequestMiddleware)
} else {
  // 生产环境只启用必要的中间件
  httpClient.addMiddleware(cacheMiddleware)
  httpClient.addMiddleware(retryMiddleware)
  httpClient.addMiddleware(authMiddleware)
  httpClient.addMiddleware(errorHandlingMiddleware)
}

// 导出配置好的HTTP客户端
export { httpClient as configuredHttpClient }

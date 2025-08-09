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

// 配置
export {
  DEFAULT_CONFIG,
  getEnvConfig,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  RESPONSE_CODES,
  ERROR_MESSAGES,
  CACHE_CONFIG,
  RETRY_CONFIG,
  PERFORMANCE_THRESHOLDS,
  validateConfig,
  isDevelopment,
  isTest,
  isStaging,
  isProduction,
  mergeConfig
} from './config'

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

// 创建并配置HTTP客户端
import { httpClient } from './HttpClient'
import { getEnvConfig } from './config'
import {
  loggingMiddleware,
  cacheMiddleware,
  retryMiddleware,
  performanceMiddleware,
  authMiddleware,
  errorHandlingMiddleware,
  cancelRequestMiddleware
} from './middleware'

// 业务服务 - 在配置完成后导入
import { UserService, userService } from './services/UserService'
import { AuthService, authService } from './services/AuthService'

// 获取环境配置
const envConfig = getEnvConfig()

// 配置HTTP客户端
httpClient.setConfig({
  baseURL: envConfig.baseURL,
  timeout: envConfig.timeout,
  retryTimes: envConfig.retryTimes,
  retryDelay: envConfig.retryDelay
})

// 根据配置添加中间件
if (envConfig.enableLogging) {
  httpClient.addMiddleware(loggingMiddleware)
}

if (envConfig.enableCache) {
  httpClient.addMiddleware(cacheMiddleware)
}

if (envConfig.enableRetry) {
  httpClient.addMiddleware(retryMiddleware)
}

if (envConfig.enablePerformance) {
  httpClient.addMiddleware(performanceMiddleware)
}

if (envConfig.enableAuth) {
  httpClient.addMiddleware(authMiddleware)
}

if (envConfig.enableErrorHandling) {
  httpClient.addMiddleware(errorHandlingMiddleware)
}

if (envConfig.enableCancelRequest) {
  httpClient.addMiddleware(cancelRequestMiddleware)
}

// 导出配置好的HTTP客户端
export { httpClient as configuredHttpClient }

// 创建常用服务实例
export const createUserService = (baseURL = null, options = {}) => {
  return httpClient.createService('user', baseURL, options)
}

export const createAuthService = (baseURL = null, options = {}) => {
  return httpClient.createService('auth', baseURL, options)
}

// 导出服务工厂函数
export const serviceFactory = {
  createUserService,
  createAuthService
}

// 导出业务服务
export { UserService, userService }
export { AuthService, authService }

// 默认导出
export default {
  httpClient: httpClient,
  userService,
  authService,
  serviceFactory,
  config: envConfig
}

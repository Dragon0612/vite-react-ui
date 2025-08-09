/**
 * API配置文件
 * 管理不同环境的配置参数
 */

// 环境配置
const ENV_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    retryTimes: 3,
    retryDelay: 1000,
    enableMock: true,
    enableCache: true,
    enableLogging: true,
    enablePerformance: true,
    enableRetry: true,
    enableAuth: true,
    enableErrorHandling: true,
    enableCancelRequest: true
  },
  test: {
    baseURL: 'http://test-api.example.com/api',
    timeout: 15000,
    retryTimes: 2,
    retryDelay: 2000,
    enableMock: false,
    enableCache: true,
    enableLogging: true,
    enablePerformance: true,
    enableRetry: true,
    enableAuth: true,
    enableErrorHandling: true,
    enableCancelRequest: true
  },
  staging: {
    baseURL: 'http://staging-api.example.com/api',
    timeout: 20000,
    retryTimes: 3,
    retryDelay: 1000,
    enableMock: false,
    enableCache: true,
    enableLogging: false,
    enablePerformance: true,
    enableRetry: true,
    enableAuth: true,
    enableErrorHandling: true,
    enableCancelRequest: true
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com/api',
    timeout: 30000,
    retryTimes: 2,
    retryDelay: 2000,
    enableMock: false,
    enableCache: true,
    enableLogging: false,
    enablePerformance: true,
    enableRetry: true,
    enableAuth: true,
    enableErrorHandling: true,
    enableCancelRequest: true
  }
}

// 获取当前环境
const getCurrentEnv = () => {
  return import.meta.env.MODE || 'development'
}

// 获取环境配置
export const getEnvConfig = () => {
  const env = getCurrentEnv()
  return ENV_CONFIG[env] || ENV_CONFIG.development
}

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  
  // 用户管理
  USER: {
    PROFILE: '/users/profile',
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    BATCH_DELETE: '/users/batch-delete',
    EXPORT: '/users/export',
    IMPORT: '/users/import'
  },
  
  // 系统设置
  SYSTEM: {
    SETTINGS: '/system/settings',
    CONFIG: '/system/config',
    LOGS: '/system/logs',
    BACKUP: '/system/backup',
    RESTORE: '/system/restore',
    HEALTH: '/system/health',
    STATS: '/system/stats'
  },
  
  // 内容管理
  CONTENT: {
    ARTICLES: '/content/articles',
    CATEGORIES: '/content/categories',
    TAGS: '/content/tags',
    MEDIA: '/content/media',
    COMMENTS: '/content/comments',
    PAGES: '/content/pages'
  },
  
  // 文件管理
  FILE: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id) => `/files/download/${id}`,
    DELETE: (id) => `/files/${id}`,
    LIST: '/files',
    INFO: (id) => `/files/${id}`,
    PREVIEW: (id) => `/files/preview/${id}`
  },
  
  // 日志管理
  LOG: {
    SYSTEM: '/logs/system',
    ACCESS: '/logs/access',
    ERROR: '/logs/error',
    OPERATION: '/logs/operation',
    CLEAN: '/logs/clean',
    EXPORT: '/logs/export'
  },
  
  // 性能监控
  PERFORMANCE: {
    METRICS: '/performance/metrics',
    MONITOR: '/performance/monitor',
    ALERT: '/performance/alert',
    REPORT: '/performance/report'
  }
}

// 请求头配置
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
}

// 响应状态码配置
export const RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}

// 错误消息配置
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  AUTH_ERROR: '认证失败，请重新登录',
  PERMISSION_ERROR: '没有权限执行此操作',
  VALIDATION_ERROR: '请求参数验证失败',
  NOT_FOUND_ERROR: '请求的资源不存在',
  UNKNOWN_ERROR: '未知错误，请稍后重试'
}

// 缓存配置
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5分钟
  USER_TTL: 10 * 60 * 1000,   // 10分钟
  SYSTEM_TTL: 30 * 60 * 1000, // 30分钟
  STATIC_TTL: 60 * 60 * 1000  // 1小时
}

// 重试配置
export const RETRY_CONFIG = {
  DEFAULT_RETRIES: 3,
  DEFAULT_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_MULTIPLIER: 2
}

// 性能阈值配置
export const PERFORMANCE_THRESHOLDS = {
  SLOW_REQUEST: 1000,    // 1秒
  VERY_SLOW_REQUEST: 3000, // 3秒
  TIMEOUT_WARNING: 5000   // 5秒
}

// 导出默认配置
export const DEFAULT_CONFIG = {
  ...getEnvConfig(),
  headers: DEFAULT_HEADERS,
  endpoints: API_ENDPOINTS,
  responseCodes: RESPONSE_CODES,
  errorMessages: ERROR_MESSAGES,
  cache: CACHE_CONFIG,
  retry: RETRY_CONFIG,
  performance: PERFORMANCE_THRESHOLDS
}

// 配置验证函数
export const validateConfig = (config) => {
  const requiredFields = ['baseURL', 'timeout']
  const errors = []
  
  requiredFields.forEach(field => {
    if (!config[field]) {
      errors.push(`缺少必需配置: ${field}`)
    }
  })
  
  if (config.timeout && (typeof config.timeout !== 'number' || config.timeout <= 0)) {
    errors.push('timeout必须是大于0的数字')
  }
  
  if (config.retryTimes && (typeof config.retryTimes !== 'number' || config.retryTimes < 0)) {
    errors.push('retryTimes必须是非负数')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 环境检测函数
export const isDevelopment = () => getCurrentEnv() === 'development'
export const isTest = () => getCurrentEnv() === 'test'
export const isStaging = () => getCurrentEnv() === 'staging'
export const isProduction = () => getCurrentEnv() === 'production'

// 配置合并函数
export const mergeConfig = (baseConfig, overrideConfig) => {
  return {
    ...baseConfig,
    ...overrideConfig,
    headers: {
      ...baseConfig.headers,
      ...overrideConfig.headers
    }
  }
}

import axios from 'axios'

// 创建统一的 API 实例
const api = axios.create({
  baseURL: '/api',  // 使用统一的代理前缀
  timeout: import.meta.env.DEV ? 10000 : 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 开发环境添加调试日志
    if (import.meta.env.DEV) {
      console.log('🚀 API 请求:', config.method?.toUpperCase(), config.url)
    }
    
    // 添加认证头（如果有token）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 开发环境添加调试日志
    if (import.meta.env.DEV) {
      console.log('✅ API 响应:', response.status, response.config.url)
    }
    return response
  },
  (error) => {
    // 开发环境添加错误日志
    if (import.meta.env.DEV) {
      console.error('❌ API 错误:', error.response?.status, error.config?.url, error.message)
    }
    
    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// API 方法封装
export const apiService = {
  // GET 请求
  get: (url, config = {}) => api.get(url, config),
  
  // POST 请求
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT 请求
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // DELETE 请求
  delete: (url, config = {}) => api.delete(url, config),
  
  // 文件上传
  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }
}

// API端点配置 - 保持向后兼容性
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
    PROFILE: '/user/profile',
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

export default api

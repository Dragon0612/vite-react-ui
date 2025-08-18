import axios from 'axios'

/**
 * Apifox 集成配置
 * 项目链接: https://app.apifox.com/project/6491710
 */

// Apifox 配置
export const APIFOX_CONFIG = {
  projectId: import.meta.env.VITE_APIFOX_PROJECT_ID || '6491710',
  mockBaseUrl: import.meta.env.VITE_APIFOX_MOCK_URL || 'https://mock.apifox.com/m1/6491710-0-default',
  enabled: import.meta.env.VITE_ENABLE_MOCK === 'true' && import.meta.env.DEV,
  token: 'shpT2Zh4YXB4oeDJ44Q47', // Apifox 接口认证 token
  
  // 环境配置
  environments: {
    development: {
      baseUrl: 'https://m1.apifoxmock.com/m1/6491710-6191887-default',
      timeout: 10000
    },
    testing: {
      baseUrl: 'https://mock.apifox.com/m1/6491710-1-testing',
      timeout: 15000
    },
    production: {
      baseUrl: import.meta.env.VITE_API_BASE_URL,
      timeout: 5000
    }
  }
}

// 创建 Apifox Mock 实例
export const apifoxMockInstance = axios.create({
  baseURL: APIFOX_CONFIG.environments.development.baseUrl,
  timeout: APIFOX_CONFIG.environments.development.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer shpT2Zh4YXB4oeDJ44Q47',
    'apifoxToken': 'shpT2Zh4YXB4oeDJ44Q47'
  }
})

// Apifox Mock 请求拦截器
apifoxMockInstance.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('🎭 Apifox Mock 请求:', config.method?.toUpperCase(), config.url)
    }
    return config
  },
  (error) => {
    console.error('❌ Apifox Mock 请求错误:', error)
    return Promise.reject(error)
  }
)

// Apifox Mock 响应拦截器
apifoxMockInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ Apifox Mock 响应:', response.status, response.config.url)
    }
    return response
  },
  (error) => {
    console.error('❌ Apifox Mock 响应错误:', error.response?.status, error.config?.url)
    return Promise.reject(error)
  }
)

/**
 * 智能 API 调用器
 * 根据环境自动选择真实 API 或 Mock API
 */
export const createSmartApiCall = (realApiCall, mockEndpoint) => {
  return async (...args) => {
    // 如果启用了 Mock 且在开发环境，使用 Apifox Mock
    if (APIFOX_CONFIG.enabled) {
      try {
        console.log(`🎭 使用 Apifox Mock: ${mockEndpoint}`)
        const response = await apifoxMockInstance.get(mockEndpoint)
        return response.data
      } catch (error) {
        console.warn('⚠️ Apifox Mock 失败，降级到真实 API:', error.message)
        return realApiCall(...args)
      }
    }
    
    // 否则使用真实 API
    return realApiCall(...args)
  }
}

/**
 * Apifox 项目信息
 */
export const APIFOX_PROJECT_INFO = {
  id: '6491710',
  name: 'Vite React UI 项目 API',
  url: 'https://app.apifox.com/project/6491710',
  mockUrl: 'https://mock.apifox.com/m1/6491710-0-default',
  
  // 常用端点映射
  endpoints: {
    // 用户相关
    users: '/users',
    userProfile: '/user/profile',
    userStats: '/user/stats',
    
    // 认证相关
    login: '/system/login',
    logout: '/system/logout', 
    register: '/system/register',
    
    // 系统相关
    systemInfo: '/system/info',
    systemStats: '/system/stats',
    systemLogs: '/system/logs',
    
    // 内容管理
    articles: '/content/articles',
    categories: '/content/categories',
    
    // 文件管理
    fileUpload: '/files/upload',
    fileList: '/files',
  }
}

/**
 * 生成 Apifox API 调用函数
 */
export const createApifoxApi = (endpoint) => {
  return {
    get: (params = {}) => apifoxMockInstance.get(endpoint, { params }),
    post: (data = {}) => apifoxMockInstance.post(endpoint, data),
    put: (data = {}) => apifoxMockInstance.put(endpoint, data),
    delete: () => apifoxMockInstance.delete(endpoint),
  }
}

// 导出配置状态
export const isApifoxEnabled = () => APIFOX_CONFIG.enabled
export const getApifoxProjectUrl = () => APIFOX_PROJECT_INFO.url
export const getApifoxMockUrl = () => APIFOX_CONFIG.mockBaseUrl

console.log(`🎭 Apifox 集成状态: ${APIFOX_CONFIG.enabled ? '已启用' : '已禁用'}`)
if (APIFOX_CONFIG.enabled) {
  console.log(`📡 Mock 服务地址: ${APIFOX_CONFIG.mockBaseUrl}`)
  console.log(`🔗 项目地址: ${APIFOX_PROJECT_INFO.url}`)
}

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
  
  // 🤖 智能缓存策略配置 - 基于规则自动判断
  cacheStrategy: {
    // 🎯 自动缓存规则引擎
    rules: {
      // 🚫 绝对禁用缓存的模式（安全敏感）
      noCache: {
        keywords: ['login', 'logout', 'register', 'auth', 'password', 'payment', 'pay', 'order', 'realtime', 'live'],
        paths: ['/system/login', '/system/logout', '/auth/', '/payment/'],
        methods: ['POST', 'PUT', 'DELETE', 'PATCH'] // 写操作默认不缓存
      },
      
      // 📦 长期缓存（1小时+ 静态配置类）
      longCache: {
        keywords: ['config', 'setting', 'dictionary', 'dict', 'constant', 'enum'],
        maxAge: 3600 // 1小时
      },
      
      // 🕐 中期缓存（10-30分钟 相对稳定数据）
      mediumCache: {
        keywords: ['category', 'categories', 'tag', 'menu', 'navigation', 'department'],
        maxAge: 1800 // 30分钟
      },
      
      // ⚡ 短期缓存（5分钟 用户相关）
      shortCache: {
        keywords: ['profile', 'info', 'detail', 'user'],
        maxAge: 300 // 5分钟
      },
      
      // 🔄 默认缓存（1分钟 其他GET请求）
      defaultCache: {
        maxAge: 60 // 1分钟
      }
    }
  },
  
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

// Apifox Mock 请求拦截器 - 智能缓存策略
apifoxMockInstance.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('🎭 Apifox Mock 请求:', config.method?.toUpperCase(), config.url)
    }
    
    // 🤖 智能缓存策略：自动判断，无需手动配置
    const cacheStrategy = getSmartCacheStrategy(config.url, config.method)
    
    // 应用缓存策略
    if (cacheStrategy.headers) {
      config.headers = {
        ...config.headers,
        ...cacheStrategy.headers
      }
    }
    
    // 添加时间戳防缓存（仅限需要的情况）
    if (cacheStrategy.addTimestamp) {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // 📊 日志输出
    console.log(`🎯 自动缓存策略 [${cacheStrategy.strategy}]:`, config.url)
    
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

/**
 * 🤖 智能缓存策略引擎
 * 基于URL、方法、关键词自动判断缓存策略
 */
export const getSmartCacheStrategy = (url, method = 'GET') => {
  const { rules } = APIFOX_CONFIG.cacheStrategy
  const lowerUrl = url.toLowerCase()
  const upperMethod = method.toUpperCase()
  
  // 🚫 优先级1: 检查是否应该禁用缓存
  const shouldNoCache = 
    // 写操作默认不缓存
    rules.noCache.methods.includes(upperMethod) ||
    // URL路径匹配
    rules.noCache.paths.some(path => lowerUrl.includes(path.toLowerCase())) ||
    // 关键词匹配
    rules.noCache.keywords.some(keyword => lowerUrl.includes(keyword))
  
  if (shouldNoCache) {
    return {
      strategy: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      addTimestamp: upperMethod === 'GET' // GET请求添加时间戳
    }
  }
  
  // 只对GET请求进行缓存优化
  if (upperMethod !== 'GET') {
    return { strategy: 'no-cache-write-operation' }
  }
  
  // 🎯 优先级2: 检查长期缓存
  const isLongCache = rules.longCache.keywords.some(keyword => 
    lowerUrl.includes(keyword)
  )
  if (isLongCache) {
    return {
      strategy: 'long-cache',
      headers: {
        'Cache-Control': `public, max-age=${rules.longCache.maxAge}`
      }
    }
  }
  
  // 🎯 优先级3: 检查中期缓存
  const isMediumCache = rules.mediumCache.keywords.some(keyword => 
    lowerUrl.includes(keyword)
  )
  if (isMediumCache) {
    return {
      strategy: 'medium-cache',
      headers: {
        'Cache-Control': `public, max-age=${rules.mediumCache.maxAge}`
      }
    }
  }
  
  // 🎯 优先级4: 检查短期缓存
  const isShortCache = rules.shortCache.keywords.some(keyword => 
    lowerUrl.includes(keyword)
  )
  if (isShortCache) {
    return {
      strategy: 'short-cache',
      headers: {
        'Cache-Control': `private, max-age=${rules.shortCache.maxAge}`
      }
    }
  }
  
  // 🎯 默认策略: 轻量缓存
  return {
    strategy: 'default-cache',
    headers: {
      'Cache-Control': `private, max-age=${rules.defaultCache.maxAge}`
    }
  }
}

/**
 * 🧪 智能缓存策略测试示例
 * 展示不同URL的自动缓存判断结果
 */
export const testSmartCacheStrategy = () => {
  const testUrls = [
    // 🚫 应该禁用缓存的URL
    { url: '/system/login', method: 'GET' },
    { url: '/auth/logout', method: 'POST' },
    { url: '/payment/create', method: 'POST' },
    { url: '/user/password', method: 'PUT' },
    
    // 📦 应该长期缓存的URL  
    { url: '/api/config', method: 'GET' },
    { url: '/system/dictionary', method: 'GET' },
    { url: '/settings/global', method: 'GET' },
    
    // 🕐 应该中期缓存的URL
    { url: '/api/categories', method: 'GET' },
    { url: '/menu/navigation', method: 'GET' },
    { url: '/department/list', method: 'GET' },
    
    // ⚡ 应该短期缓存的URL
    { url: '/user/profile', method: 'GET' },
    { url: '/user/info', method: 'GET' },
    { url: '/product/detail/123', method: 'GET' },
    
    // 🔄 应该默认缓存的URL
    { url: '/api/news', method: 'GET' },
    { url: '/content/articles', method: 'GET' }
  ]
  
  console.log('🧪 智能缓存策略测试结果:')
  testUrls.forEach(({ url, method }) => {
    const strategy = getSmartCacheStrategy(url, method)
    console.log(`${url} [${method}] → ${strategy.strategy}`)
  })
}

console.log(`🎭 Apifox 集成状态: ${APIFOX_CONFIG.enabled ? '已启用' : '已禁用'}`)
if (APIFOX_CONFIG.enabled) {
  console.log(`📡 Mock 服务地址: ${APIFOX_CONFIG.mockBaseUrl}`)
  console.log(`🔗 项目地址: ${APIFOX_PROJECT_INFO.url}`)
  
  // 🧪 在开发环境下运行测试
  if (import.meta.env.DEV) {
    testSmartCacheStrategy()
  }
}

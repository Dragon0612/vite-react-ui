import { message } from 'antd'

/**
 * 日志中间件
 * 记录所有API请求和响应
 */
export const loggingMiddleware = (service) => {
  const originalGet = service.get
  const originalPost = service.post
  const originalPut = service.put
  const originalDelete = service.delete

  // 包装GET请求
  service.get = async function(url, config = {}) {
    console.log(`[API] GET ${url}`, config)
    try {
      const result = await originalGet.call(this, url, config)
      console.log(`[API] GET ${url} 成功:`, result)
      return result
    } catch (error) {
      console.error(`[API] GET ${url} 失败:`, error)
      throw error
    }
  }

  // 包装POST请求
  service.post = async function(url, data, config = {}) {
    console.log(`[API] POST ${url}`, { data, config })
    try {
      const result = await originalPost.call(this, url, data, config)
      console.log(`[API] POST ${url} 成功:`, result)
      return result
    } catch (error) {
      console.error(`[API] POST ${url} 失败:`, error)
      throw error
    }
  }

  // 包装PUT请求
  service.put = async function(url, data, config = {}) {
    console.log(`[API] PUT ${url}`, { data, config })
    try {
      const result = await originalPut.call(this, url, data, config)
      console.log(`[API] PUT ${url} 成功:`, result)
      return result
    } catch (error) {
      console.error(`[API] PUT ${url} 失败:`, error)
      throw error
    }
  }

  // 包装DELETE请求
  service.delete = async function(url, config = {}) {
    console.log(`[API] DELETE ${url}`, config)
    try {
      const result = await originalDelete.call(this, url, config)
      console.log(`[API] DELETE ${url} 成功:`, result)
      return result
    } catch (error) {
      console.error(`[API] DELETE ${url} 失败:`, error)
      throw error
    }
  }
}

/**
 * 缓存中间件
 * 为GET请求添加缓存功能
 */
export const cacheMiddleware = (service, options = {}) => {
  const cache = new Map()
  const { ttl = 5 * 60 * 1000 } = options // 默认5分钟缓存

  const originalGet = service.get

  service.get = async function(url, config = {}) {
    // 检查是否启用缓存
    if (config.cache === false) {
      return originalGet.call(this, url, config)
    }

    const cacheKey = `${url}_${JSON.stringify(config)}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log(`[Cache] 命中缓存: ${url}`)
      return cached.data
    }

    const result = await originalGet.call(this, url, config)
    
    // 缓存结果
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    })

    return result
  }

  // 清除缓存方法
  service.clearCache = (pattern) => {
    if (pattern) {
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      cache.clear()
    }
  }
}

/**
 * 重试中间件
 * 为失败的请求添加重试逻辑
 */
export const retryMiddleware = (service, options = {}) => {
  const { maxRetries = 3, retryDelay = 1000, retryableStatuses = [500, 502, 503, 504] } = options

  const originalRequest = service.api.request

  service.api.request = async function(config) {
    let lastError
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        return await originalRequest.call(this, config)
      } catch (error) {
        lastError = error
        attempt++

        // 检查是否应该重试
        if (attempt > maxRetries || !shouldRetry(error, retryableStatuses)) {
          break
        }

        console.log(`[Retry] 第${attempt}次重试: ${config.url}`)
        await delay(retryDelay * attempt) // 递增延迟
      }
    }

    throw lastError
  }

  function shouldRetry(error, retryableStatuses) {
    return error.response && retryableStatuses.includes(error.response.status)
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * 性能监控中间件
 * 监控API请求性能
 */
export const performanceMiddleware = (service) => {
  const metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalResponseTime: 0,
    averageResponseTime: 0
  }

  const originalRequest = service.api.request

  service.api.request = async function(config) {
    const startTime = Date.now()
    metrics.totalRequests++

    try {
      const response = await originalRequest.call(this, config)
      const responseTime = Date.now() - startTime
      
      metrics.successfulRequests++
      metrics.totalResponseTime += responseTime
      metrics.averageResponseTime = metrics.totalResponseTime / metrics.successfulRequests

      // 记录慢请求
      if (responseTime > 1000) {
        console.warn(`[Performance] 慢请求: ${config.url} (${responseTime}ms)`)
      }

      return response
    } catch (error) {
      metrics.failedRequests++
      throw error
    }
  }

  // 获取性能指标
  service.getMetrics = () => ({ ...metrics })
}

/**
 * 认证中间件
 * 处理认证token的自动刷新
 */
export const authMiddleware = (service) => {
  let isRefreshing = false
  let failedQueue = []

  const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
    failedQueue = []
  }

  const originalRequest = service.api.request

  service.api.request = async function(config) {
    // 检查是否需要刷新token
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        config.headers.Authorization = `Bearer ${token}`
        return originalRequest.call(this, config)
      }).catch(err => {
        return Promise.reject(err)
      })
    }

    try {
      return await originalRequest.call(this, config)
    } catch (error) {
      if (error.response?.status === 401 && !config._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            config.headers.Authorization = `Bearer ${token}`
            return originalRequest.call(this, config)
          }).catch(err => {
            return Promise.reject(err)
          })
        }

        config._retry = true
        isRefreshing = true

        try {
          // 尝试刷新token
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            const response = await service.post('/auth/refresh', { refreshToken })
            const newToken = response.data.token
            
            localStorage.setItem('token', newToken)
            config.headers.Authorization = `Bearer ${newToken}`
            
            processQueue(null, newToken)
            isRefreshing = false
            
            return originalRequest.call(this, config)
          } else {
            throw new Error('No refresh token available')
          }
        } catch (refreshError) {
          processQueue(refreshError, null)
          isRefreshing = false
          
          // 清除所有认证信息并跳转登录
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          
          return Promise.reject(refreshError)
        }
      }
      
      return Promise.reject(error)
    }
  }
}

/**
 * 错误处理中间件
 * 统一处理API错误
 */
export const errorHandlingMiddleware = (service) => {
  const originalRequest = service.api.request

  service.api.request = async function(config) {
    try {
      return await originalRequest.call(this, config)
    } catch (error) {
      // 根据错误类型进行不同处理
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            message.error(data?.message || '请求参数错误')
            break
          case 401:
            // 认证中间件会处理
            break
          case 403:
            message.error('没有权限执行此操作')
            break
          case 404:
            message.error('请求的资源不存在')
            break
          case 422:
            message.error(data?.message || '数据验证失败')
            break
          case 500:
            message.error('服务器内部错误，请稍后重试')
            break
          default:
            message.error(data?.message || '请求失败')
        }
      } else if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请检查网络连接')
      } else if (error.message === 'Network Error') {
        message.error('网络错误，请检查网络连接')
      }

      throw error
    }
  }
}

/**
 * 请求取消中间件
 * 支持请求取消功能
 */
export const cancelRequestMiddleware = (service) => {
  const pendingRequests = new Map()

  const originalRequest = service.api.request

  service.api.request = async function(config) {
    // 生成取消token
    const cancelToken = config.cancelToken || `cancel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    if (!config.cancelToken) {
      config.cancelToken = cancelToken
    }

    // 存储请求引用
    const requestRef = { cancelled: false }
    pendingRequests.set(cancelToken, requestRef)

    try {
      const response = await originalRequest.call(this, config)
      pendingRequests.delete(cancelToken)
      return response
    } catch (error) {
      pendingRequests.delete(cancelToken)
      
      if (requestRef.cancelled) {
        console.log(`[Cancel] 请求已取消: ${config.url}`)
      }
      
      throw error
    }
  }

  // 取消请求方法
  service.cancelRequest = (cancelToken) => {
    const requestRef = pendingRequests.get(cancelToken)
    if (requestRef) {
      requestRef.cancelled = true
      pendingRequests.delete(cancelToken)
      return true
    }
    return false
  }

  // 取消所有请求
  service.cancelAllRequests = () => {
    for (const [token, requestRef] of pendingRequests) {
      requestRef.cancelled = true
    }
    pendingRequests.clear()
  }
}

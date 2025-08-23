/**
 * HTTP请求配置和处理
 * 统一管理axios实例、拦截器和请求方法
 */

import axios from 'axios'
import { message } from 'antd'

/**
 * HTTP配置常量
 */
export const HTTP_CONFIG = {
  // 基础URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // 请求超时时间
  timeout: 30000,
  
  // 默认请求头
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // 重试配置
  retry: {
    count: 3,
    delay: 1000
  },
  
  // 缓存配置
  cache: {
    enabled: false,
    maxAge: 5 * 60 * 1000 // 5分钟
  }
}

/**
 * 创建axios实例
 */
export const createHttpInstance = (config = {}) => {
  const instance = axios.create({
    ...HTTP_CONFIG,
    ...config
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加时间戳防止缓存
      config.headers['X-Request-Time'] = Date.now()
      
      // 添加认证token
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log(`🚀 [HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
      
      return config
    },
    (error) => {
      console.error('❌ [HTTP] Request Error:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ [HTTP] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
      
      // 统一处理响应数据
      if (response.data && typeof response.data === 'object') {
        // 如果后端返回标准格式 {code, data, message}
        if (response.data.code !== undefined) {
          if (response.data.code === 200 || response.data.code === 0) {
            return response.data.data || response.data
          } else {
            throw new Error(response.data.message || '请求失败')
          }
        }
      }
      
      return response.data
    },
    (error) => {
      console.error('❌ [HTTP] Response Error:', error)
      
      // 统一错误处理
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 401:
            message.error('登录已过期，请重新登录')
            localStorage.removeItem('auth_token')
            // 可以在这里跳转到登录页
            break
          case 403:
            message.error('没有访问权限')
            break
          case 404:
            message.error('请求的资源不存在')
            break
          case 500:
            message.error('服务器内部错误')
            break
          default:
            message.error(data?.message || '请求失败')
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络')
      } else {
        message.error(error.message || '请求配置错误')
      }
      
      return Promise.reject(error)
    }
  )

  return instance
}

/**
 * 默认HTTP实例
 */
export const httpInstance = createHttpInstance()

/**
 * HTTP请求方法
 */
export const http = {
  /**
   * GET请求
   */
  get: (url, params = {}, config = {}) => {
    return httpInstance.get(url, { params, ...config })
  },

  /**
   * POST请求
   */
  post: (url, data = {}, config = {}) => {
    return httpInstance.post(url, data, config)
  },

  /**
   * PUT请求
   */
  put: (url, data = {}, config = {}) => {
    return httpInstance.put(url, data, config)
  },

  /**
   * DELETE请求
   */
  delete: (url, config = {}) => {
    return httpInstance.delete(url, config)
  },

  /**
   * PATCH请求
   */
  patch: (url, data = {}, config = {}) => {
    return httpInstance.patch(url, data, config)
  },

  /**
   * 文件上传
   */
  upload: (url, file, config = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return httpInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  },

  /**
   * 文件下载
   */
  download: (url, params = {}, filename = '') => {
    return httpInstance.get(url, {
      params,
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }
}

/**
 * 取消请求Token工厂
 */
export const createCancelToken = () => {
  return axios.CancelToken.source()
}

/**
 * 判断是否为取消请求的错误
 */
export const isCancelError = (error) => {
  return axios.isCancel(error)
}

/**
 * 设置认证Token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
    httpInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('auth_token')
    delete httpInstance.defaults.headers.common['Authorization']
  }
}

/**
 * 获取认证Token
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

/**
 * 清除认证信息
 */
export const clearAuth = () => {
  localStorage.removeItem('auth_token')
  delete httpInstance.defaults.headers.common['Authorization']
}

/**
 * 重试函数
 */
export const withRetry = async (fn, retryCount = HTTP_CONFIG.retry.count, delay = HTTP_CONFIG.retry.delay) => {
  try {
    return await fn()
  } catch (error) {
    if (retryCount > 0 && !isCancelError(error)) {
      console.log(`🔄 [HTTP] Retrying... attempts left: ${retryCount}`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return withRetry(fn, retryCount - 1, delay)
    }
    throw error
  }
}

// 默认导出
export default http

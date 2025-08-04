import axios from 'axios'
import { message } from 'antd'

// ========================================
// 请求配置
// ========================================

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ========================================
// 请求拦截器
// ========================================

request.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求时间戳（防止缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    // 显示加载状态
    if (config.showLoading !== false) {
      // 可以在这里添加全局 loading 状态
      console.log('Request started:', config.url)
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// ========================================
// 响应拦截器
// ========================================

request.interceptors.response.use(
  (response) => {
    // 隐藏加载状态
    if (response.config.showLoading !== false) {
      console.log('Request completed:', response.config.url)
    }

    // 统一处理响应数据
    const { data, status } = response
    
    // 如果后端返回的是标准格式 { code, data, message }
    if (data && typeof data.code !== 'undefined') {
      if (data.code === 200 || data.code === 0) {
        return data.data
      } else {
        // 业务错误
        const error = new Error(data.message || '请求失败')
        error.code = data.code
        error.data = data
        return Promise.reject(error)
      }
    }

    // 直接返回数据
    return data
  },
  (error) => {
    // 隐藏加载状态
    if (error.config?.showLoading !== false) {
      console.log('Request failed:', error.config?.url)
    }

    // 统一错误处理
    const { response, message: errorMessage } = error

    if (response) {
      const { status, data } = response

      switch (status) {
        case 400:
          message.error(data?.message || '请求参数错误')
          break
        case 401:
          message.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问该资源')
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
    } else if (errorMessage) {
      if (errorMessage.includes('timeout')) {
        message.error('请求超时，请检查网络连接')
      } else if (errorMessage.includes('Network Error')) {
        message.error('网络错误，请检查网络连接')
      } else {
        message.error(errorMessage)
      }
    } else {
      message.error('未知错误')
    }

    return Promise.reject(error)
  }
)

// ========================================
// 通用请求函数
// ========================================

/**
 * GET 请求
 * @param {string} url - 请求地址
 * @param {object} params - 查询参数
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
export const get = (url, params = {}, config = {}) => {
  return request.get(url, { params, ...config })
}

/**
 * POST 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
export const post = (url, data = {}, config = {}) => {
  return request.post(url, data, config)
}

/**
 * PUT 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
export const put = (url, data = {}, config = {}) => {
  return request.put(url, data, config)
}

/**
 * DELETE 请求
 * @param {string} url - 请求地址
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
export const del = (url, config = {}) => {
  return request.delete(url, config)
}

/**
 * PATCH 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
export const patch = (url, data = {}, config = {}) => {
  return request.patch(url, data, config)
}

// ========================================
// 高级请求函数
// ========================================

/**
 * 上传文件
 * @param {string} url - 上传地址
 * @param {FormData} formData - 表单数据
 * @param {object} config - 请求配置
 * @returns {Promise}
 */
export const upload = (url, formData, config = {}) => {
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}

/**
 * 下载文件
 * @param {string} url - 下载地址
 * @param {object} params - 查询参数
 * @param {string} filename - 文件名
 * @returns {Promise}
 */
export const download = async (url, params = {}, filename = '') => {
  try {
    const response = await request.get(url, {
      params,
      responseType: 'blob',
    })

    // 创建下载链接
    const blob = new Blob([response])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    return response
  } catch (error) {
    message.error('下载失败')
    throw error
  }
}

/**
 * 并发请求
 * @param {Array} requests - 请求数组
 * @returns {Promise}
 */
export const all = (requests) => {
  return Promise.all(requests)
}

/**
 * 竞态请求（返回最先完成的）
 * @param {Array} requests - 请求数组
 * @returns {Promise}
 */
export const race = (requests) => {
  return Promise.race(requests)
}

// ========================================
// 工具函数
// ========================================

/**
 * 设置认证 token
 * @param {string} token - 认证 token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token)
}

/**
 * 获取认证 token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token')
}

/**
 * 清除认证 token
 */
export const clearToken = () => {
  localStorage.removeItem('token')
}

/**
 * 设置请求基础 URL
 * @param {string} baseURL - 基础 URL
 */
export const setBaseURL = (baseURL) => {
  request.defaults.baseURL = baseURL
}

/**
 * 设置请求超时时间
 * @param {number} timeout - 超时时间（毫秒）
 */
export const setTimeout = (timeout) => {
  request.defaults.timeout = timeout
}

// ========================================
// 导出
// ========================================

export default request 
import axios from 'axios'
import { message } from 'antd'

/**
 * API服务基类
 * 提供统一的HTTP方法和拦截器配置
 */
export class BaseApiService {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL
    this.options = {
      timeout: 10000,
      retryTimes: 3,
      retryDelay: 1000,
      ...options
    }
    
    this.api = axios.create({
      baseURL,
      timeout: this.options.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  setupInterceptors() {
    // 请求拦截器
    this.api.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    )
    
    // 响应拦截器
    this.api.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    )
  }

  /**
   * 请求拦截器
   */
  handleRequest(config) {
    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求时间戳
    config.metadata = { startTime: new Date() }
    
    // 添加请求ID用于追踪
    config.requestId = this.generateRequestId()
    
    return config
  }

  /**
   * 请求错误处理
   */
  handleRequestError(error) {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }

  /**
   * 响应拦截器
   */
  handleResponse(response) {
    // 计算请求耗时
    const duration = new Date() - response.config.metadata.startTime
    console.log(`API请求 ${response.config.url} 耗时: ${duration}ms`)
    
    // 统一响应格式处理
    if (response.data && response.data.code !== undefined) {
      // 如果后端返回了标准格式，直接返回
      return response.data
    }
    
    // 否则包装为标准格式
    return {
      code: 200,
      data: response.data,
      message: 'success',
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 响应错误处理
   */
  async handleResponseError(error) {
    const { response, config } = error
    
    // 计算请求耗时
    if (config?.metadata?.startTime) {
      const duration = new Date() - config.metadata.startTime
      console.error(`API请求 ${config.url} 失败，耗时: ${duration}ms`)
    }
    
    // 统一错误处理
    if (response) {
      switch (response.status) {
        case 401:
          // 未授权，清除token并跳转登录
          localStorage.removeItem('token')
          message.error('登录已过期，请重新登录')
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
          message.error(response.data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请检查网络连接')
    } else if (error.message === 'Network Error') {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求失败，请稍后重试')
    }
    
    return Promise.reject(error)
  }

  /**
   * 生成请求ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 重试机制
   */
  async retryRequest(requestFn, retryTimes = this.options.retryTimes) {
    try {
      return await requestFn()
    } catch (error) {
      if (retryTimes > 0 && this.shouldRetry(error)) {
        await this.delay(this.options.retryDelay)
        return this.retryRequest(requestFn, retryTimes - 1)
      }
      throw error
    }
  }

  /**
   * 判断是否应该重试
   */
  shouldRetry(error) {
    // 网络错误、超时等可以重试
    return error.code === 'ECONNABORTED' || 
           error.message === 'Network Error' ||
           (error.response && error.response.status >= 500)
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * GET请求
   */
  async get(url, config = {}) {
    return this.retryRequest(() => this.api.get(url, config))
  }

  /**
   * POST请求
   */
  async post(url, data, config = {}) {
    return this.retryRequest(() => this.api.post(url, data, config))
  }

  /**
   * PUT请求
   */
  async put(url, data, config = {}) {
    return this.retryRequest(() => this.api.put(url, data, config))
  }

  /**
   * DELETE请求
   */
  async delete(url, config = {}) {
    return this.retryRequest(() => this.api.delete(url, config))
  }

  /**
   * PATCH请求
   */
  async patch(url, data, config = {}) {
    return this.retryRequest(() => this.api.patch(url, data, config))
  }

  /**
   * 上传文件
   */
  async upload(url, file, config = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.retryRequest(() => this.api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    }))
  }

  /**
   * 下载文件
   */
  async download(url, config = {}) {
    return this.retryRequest(() => this.api.get(url, {
      ...config,
      responseType: 'blob'
    }))
  }
}

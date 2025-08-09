import { BaseApiService } from './BaseApiService'

/**
 * HTTP客户端配置
 */
const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryTimes: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
}

/**
 * HTTP客户端类
 * 管理全局配置和创建API服务实例
 */
export class HttpClient {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.services = new Map()
    this.middlewares = []
  }

  /**
   * 添加中间件
   */
  addMiddleware(middleware) {
    this.middlewares.push(middleware)
    return this
  }

  /**
   * 创建API服务实例
   */
  createService(serviceName, baseURL = null, options = {}) {
    const serviceKey = `${serviceName}_${baseURL || this.config.baseURL}`
    
    if (this.services.has(serviceKey)) {
      return this.services.get(serviceKey)
    }

    const serviceConfig = {
      ...this.config,
      ...options,
      baseURL: baseURL || this.config.baseURL
    }

    const service = new BaseApiService(serviceConfig.baseURL, serviceConfig)
    
    // 应用中间件
    this.middlewares.forEach(middleware => {
      middleware(service)
    })

    this.services.set(serviceKey, service)
    return service
  }

  /**
   * 获取已创建的服务实例
   */
  getService(serviceName, baseURL = null) {
    const serviceKey = `${serviceName}_${baseURL || this.config.baseURL}`
    return this.services.get(serviceKey)
  }

  /**
   * 清除所有服务实例
   */
  clearServices() {
    this.services.clear()
  }

  /**
   * 设置全局配置
   */
  setConfig(config) {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取全局配置
   */
  getConfig() {
    return { ...this.config }
  }

  /**
   * 设置认证token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  /**
   * 获取认证token
   */
  getAuthToken() {
    return localStorage.getItem('token')
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    localStorage.removeItem('token')
    this.clearServices()
  }
}

// 创建默认HTTP客户端实例
export const httpClient = new HttpClient()

// 导出默认配置
export { DEFAULT_CONFIG }

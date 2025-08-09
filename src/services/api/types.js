/**
 * API响应标准格式
 */
export class ApiResponse {
  constructor(data = null, code = 200, message = 'success') {
    this.code = code
    this.data = data
    this.message = message
    this.timestamp = new Date().toISOString()
    this.success = code === 200
  }

  static success(data, message = 'success') {
    return new ApiResponse(data, 200, message)
  }

  static error(message = 'error', code = 500) {
    return new ApiResponse(null, code, message)
  }

  static fromResponse(response) {
    if (response && typeof response === 'object') {
      return new ApiResponse(
        response.data,
        response.code || 200,
        response.message || 'success'
      )
    }
    return new ApiResponse(response)
  }
}

/**
 * 分页请求参数
 */
export class PaginationParams {
  constructor(page = 1, pageSize = 10, sortBy = null, sortOrder = 'asc') {
    this.page = page
    this.pageSize = pageSize
    this.sortBy = sortBy
    this.sortOrder = sortOrder
  }

  toQueryString() {
    const params = new URLSearchParams()
    params.append('page', this.page.toString())
    params.append('pageSize', this.pageSize.toString())
    
    if (this.sortBy) {
      params.append('sortBy', this.sortBy)
      params.append('sortOrder', this.sortOrder)
    }
    
    return params.toString()
  }

  static fromObject(obj) {
    return new PaginationParams(
      obj.page || 1,
      obj.pageSize || 10,
      obj.sortBy || null,
      obj.sortOrder || 'asc'
    )
  }
}

/**
 * 分页响应数据
 */
export class PaginatedResponse {
  constructor(list = [], total = 0, page = 1, pageSize = 10) {
    this.list = list
    this.total = total
    this.page = page
    this.pageSize = pageSize
    this.totalPages = Math.ceil(total / pageSize)
    this.hasNext = page < this.totalPages
    this.hasPrev = page > 1
  }

  static fromResponse(response) {
    if (response && response.data) {
      const { list, total, page, pageSize } = response.data
      return new PaginatedResponse(list, total, page, pageSize)
    }
    return new PaginatedResponse()
  }
}

/**
 * 文件上传响应
 */
export class FileUploadResponse {
  constructor(fileId, fileName, fileUrl, fileSize, mimeType) {
    this.fileId = fileId
    this.fileName = fileName
    this.fileUrl = fileUrl
    this.fileSize = fileSize
    this.mimeType = mimeType
    this.uploadTime = new Date().toISOString()
  }

  static fromResponse(response) {
    if (response && response.data) {
      const { fileId, fileName, fileUrl, fileSize, mimeType } = response.data
      return new FileUploadResponse(fileId, fileName, fileUrl, fileSize, mimeType)
    }
    return null
  }
}

/**
 * 错误类型枚举
 */
export const ErrorType = {
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  AUTH: 'AUTH',
  PERMISSION: 'PERMISSION',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
}

/**
 * API错误类
 */
export class ApiError extends Error {
  constructor(message, code, type = ErrorType.UNKNOWN, details = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.type = type
    this.details = details
    this.timestamp = new Date().toISOString()
  }

  static fromAxiosError(error) {
    if (error.response) {
      const { status, data } = error.response
      let type = ErrorType.UNKNOWN
      let message = '请求失败'

      switch (status) {
        case 400:
          type = ErrorType.VALIDATION
          message = data?.message || '请求参数错误'
          break
        case 401:
          type = ErrorType.AUTH
          message = '未授权访问'
          break
        case 403:
          type = ErrorType.PERMISSION
          message = '没有权限访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          type = ErrorType.SERVER
          message = '服务器内部错误'
          break
        default:
          message = data?.message || `请求失败 (${status})`
      }

      return new ApiError(message, status, type, data)
    } else if (error.code === 'ECONNABORTED') {
      return new ApiError('请求超时', 408, ErrorType.TIMEOUT)
    } else if (error.message === 'Network Error') {
      return new ApiError('网络错误', 0, ErrorType.NETWORK)
    }

    return new ApiError(error.message || '未知错误', 0, ErrorType.UNKNOWN)
  }

  isNetworkError() {
    return this.type === ErrorType.NETWORK
  }

  isAuthError() {
    return this.type === ErrorType.AUTH
  }

  isPermissionError() {
    return this.type === ErrorType.PERMISSION
  }

  isValidationError() {
    return this.type === ErrorType.VALIDATION
  }

  isServerError() {
    return this.type === ErrorType.SERVER
  }

  isTimeoutError() {
    return this.type === ErrorType.TIMEOUT
  }
}

/**
 * 请求配置类型
 */
export const RequestConfig = {
  // 请求超时时间
  TIMEOUT: 'timeout',
  // 重试次数
  RETRY_TIMES: 'retryTimes',
  // 重试延迟
  RETRY_DELAY: 'retryDelay',
  // 是否显示加载状态
  SHOW_LOADING: 'showLoading',
  // 是否显示错误提示
  SHOW_ERROR: 'showError',
  // 自定义错误处理
  ERROR_HANDLER: 'errorHandler',
  // 请求取消token
  CANCEL_TOKEN: 'cancelToken'
}

/**
 * 响应状态码
 */
export const StatusCode = {
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

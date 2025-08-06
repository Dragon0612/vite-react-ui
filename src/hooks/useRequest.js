import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'

/**
 * 自定义 Hook：用于管理请求状态
 * @param {Function} requestFn - 请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} 返回状态和操作方法
 */
export function useRequest(requestFn, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestFn(...args)
      setData(result)
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (err) {
      setError(err)
      
      if (options.onError) {
        options.onError(err)
      } else {
        // 默认错误处理
        message.error(err.message || '请求失败')
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [requestFn, options])

  useEffect(() => {
    if (options.autoExecute !== false) {
      execute()
    }
  }, [execute, options.autoExecute])

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  }
}

/**
 * 自定义 Hook：用于管理列表请求
 * @param {Function} requestFn - 请求函数
 * @param {Object} options - 配置选项
 * @returns {Object} 返回列表状态和操作方法
 */
export function useListRequest(requestFn, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestFn({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      })

      // 处理分页数据
      if (result.list) {
        setData(result.list)
        setPagination(prev => ({
          ...prev,
          total: result.total || 0,
        }))
      } else {
        setData(result)
      }

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err) {
      setError(err)
      
      if (options.onError) {
        options.onError(err)
      } else {
        message.error(err.message || '获取数据失败')
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestFn, pagination.current, pagination.pageSize, options])

  const handlePageChange = useCallback((page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }))
  }, [])

  useEffect(() => {
    if (options.autoExecute !== false) {
      fetchData()
    }
  }, [fetchData, options.autoExecute])

  return {
    data,
    loading,
    error,
    pagination,
    fetchData,
    handlePageChange,
    refetch: fetchData,
  }
} 
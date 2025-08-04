import { get, post, put, del, upload } from '../utils/request'

// 产品相关 API 服务
export const productService = {
  // 获取产品列表
  getProducts: (params = {}) => get('/products', params),
  
  // 获取产品详情
  getProduct: (id) => get(`/products/${id}`),
  
  // 创建产品
  createProduct: (data) => post('/products', data),
  
  // 更新产品
  updateProduct: (id, data) => put(`/products/${id}`, data),
  
  // 删除产品
  deleteProduct: (id) => del(`/products/${id}`),
  
  // 上传产品图片
  uploadImage: (formData) => upload('/products/upload', formData),
  
  // 获取产品分类
  getCategories: () => get('/products/categories'),
  
  // 搜索产品
  searchProducts: (keyword) => get('/products/search', { keyword }),
  
  // 获取热门产品
  getHotProducts: () => get('/products/hot'),
  
  // 获取推荐产品
  getRecommendedProducts: () => get('/products/recommended'),
} 
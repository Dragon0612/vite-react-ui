import { get, post, put, del } from '@/utils/request'

// 用户相关 API 服务
export const userService = {
  // 获取用户列表
  getUsers: (params = {}) => get('/users', params),
  
  // 获取用户详情
  getUser: (id) => get(`/users/${id}`),
  
  // 创建用户
  createUser: (data) => post('/users', data),
  
  // 更新用户
  updateUser: (id, data) => put(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id) => del(`/users/${id}`),
  
  // 用户登录
  login: (data) => post('/auth/login', data),
  
  // 用户注册
  register: (data) => post('/auth/register', data),
  
  // 获取用户信息
  getProfile: () => get('/auth/profile'),
  
  // 更新用户信息
  updateProfile: (data) => put('/auth/profile', data),
  
  // 修改密码
  changePassword: (data) => post('/auth/change-password', data),
  
  // 重置密码
  resetPassword: (data) => post('/auth/reset-password', data),
} 
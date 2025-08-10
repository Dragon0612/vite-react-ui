import { createSlice } from '@reduxjs/toolkit'
import { persistState } from '../persist.js'

// 从 localStorage 加载初始状态
const loadUserState = () => {
  return persistState.load('user', {
    user: null,
    token: null,
    isLoggedIn: false,
    theme: 'light',
    language: 'zh-CN'
  })
}

const userSlice = createSlice({
  name: 'user',
  initialState: loadUserState(),
  reducers: {
    // 设置用户信息
    setUser: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
      // 自动保存到 localStorage
      persistState.save('user', state)
    },
    
    // 设置令牌
    setToken: (state, action) => {
      state.token = action.payload
      persistState.save('user', state)
    },
    
    // 登录
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoggedIn = true
      persistState.save('user', state)
    },
    
    // 登出
    logout: (state) => {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      persistState.save('user', state)
    },
    
    // 更新用户信息
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      persistState.save('user', state)
    },
    
    // 切换主题
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      persistState.save('user', state)
    },
    
    // 设置语言
    setLanguage: (state, action) => {
      state.language = action.payload
      persistState.save('user', state)
    }
  }
})

export const {
  setUser,
  setToken,
  login,
  logout,
  updateUser,
  toggleTheme,
  setLanguage
} = userSlice.actions

export default userSlice.reducer

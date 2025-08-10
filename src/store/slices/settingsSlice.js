import { createSlice } from '@reduxjs/toolkit'
import { persistState } from '../persist.js'

// 从 localStorage 加载初始状态
const loadSettingsState = () => {
  return persistState.load('settings', {
    sidebarCollapsed: false,
    breadcrumbVisible: true,
    pageSize: 10,
    autoSave: true,
    notifications: {
      enabled: true,
      sound: true,
      desktop: false
    },
    layout: {
      headerHeight: 64,
      sidebarWidth: 200,
      sidebarCollapsedWidth: 80
    }
  })
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettingsState(),
  reducers: {
    // 切换侧边栏
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
      persistState.save('settings', state)
    },
    
    // 设置侧边栏状态
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
      persistState.save('settings', state)
    },
    
    // 切换面包屑显示
    toggleBreadcrumb: (state) => {
      state.breadcrumbVisible = !state.breadcrumbVisible
      persistState.save('settings', state)
    },
    
    // 设置页面大小
    setPageSize: (state, action) => {
      state.pageSize = action.payload
      persistState.save('settings', state)
    },
    
    // 切换自动保存
    toggleAutoSave: (state) => {
      state.autoSave = !state.autoSave
      persistState.save('settings', state)
    },
    
    // 更新通知设置
    updateNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload }
      persistState.save('settings', state)
    },
    
    // 更新布局设置
    updateLayout: (state, action) => {
      state.layout = { ...state.layout, ...action.payload }
      persistState.save('settings', state)
    },
    
    // 重置设置
    resetSettings: (state) => {
      const defaultState = loadSettingsState()
      Object.assign(state, defaultState)
      persistState.save('settings', state)
    }
  }
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleBreadcrumb,
  setPageSize,
  toggleAutoSave,
  updateNotifications,
  updateLayout,
  resetSettings
} = settingsSlice.actions

export default settingsSlice.reducer

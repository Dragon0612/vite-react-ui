import { useUserStore, useSettingsStore } from '@/store/zustand'

// 便捷的用户状态 hooks
export const useUser = () => {
  return useUserStore()
}

export const useUserInfo = () => {
  return useUserStore(state => state.userInfo)
}

export const useIsLoggedIn = () => {
  return useUserStore(state => state.isLoggedIn)
}

export const useToken = () => {
  return useUserStore(state => state.token)
}

export const useTheme = () => {
  return useUserStore(state => state.theme)
}

export const useLanguage = () => {
  return useUserStore(state => state.language)
}

// 便捷的设置状态 hooks
export const useSettings = () => {
  return useSettingsStore()
}

export const useSidebarCollapsed = () => {
  return useSettingsStore(state => state.layout.sidebarCollapsed)
}

export const useBreadcrumbVisible = () => {
  return useSettingsStore(state => state.ui.showBreadcrumb)
}

export const usePageSize = () => {
  return useSettingsStore(state => state.ui.pageSize || 10)
}

export const useAutoSave = () => {
  return useSettingsStore(state => state.system.autoSave)
}

export const useNotifications = () => {
  return useSettingsStore(state => state.system.notifications)
}

export const useLayout = () => {
  return useSettingsStore(state => state.layout)
}

// 兼容性导出（为了保持现有代码不变）
export const useAppSelector = (selector) => {
  // 这里可以根据需要实现一个通用的selector
  console.warn('useAppSelector is deprecated, please use Zustand stores directly')
  return null
}

export const useAppDispatch = () => {
  console.warn('useAppDispatch is deprecated, please use Zustand stores directly')
  return null
}

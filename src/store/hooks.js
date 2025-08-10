import { useDispatch, useSelector } from 'react-redux'

// 类型化的 useSelector hook
export const useAppSelector = useSelector

// 类型化的 useDispatch hook
export const useAppDispatch = useDispatch

// 便捷的用户状态 hooks
export const useUser = () => {
  return useSelector(state => state.user)
}

export const useUserInfo = () => {
  return useSelector(state => state.user.user)
}

export const useIsLoggedIn = () => {
  return useSelector(state => state.user.isLoggedIn)
}

export const useToken = () => {
  return useSelector(state => state.user.token)
}

export const useTheme = () => {
  return useSelector(state => state.user.theme)
}

export const useLanguage = () => {
  return useSelector(state => state.user.language)
}

// 便捷的设置状态 hooks
export const useSettings = () => {
  return useSelector(state => state.settings)
}

export const useSidebarCollapsed = () => {
  return useSelector(state => state.settings.sidebarCollapsed)
}

export const useBreadcrumbVisible = () => {
  return useSelector(state => state.settings.breadcrumbVisible)
}

export const usePageSize = () => {
  return useSelector(state => state.settings.pageSize)
}

export const useAutoSave = () => {
  return useSelector(state => state.settings.autoSave)
}

export const useNotifications = () => {
  return useSelector(state => state.settings.notifications)
}

export const useLayout = () => {
  return useSelector(state => state.settings.layout)
}

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      // 用户基本信息
      user: null,
      token: null,
      isLoggedIn: false,
      
      // 用户详细信息
      userInfo: {
        id: '1',
        username: 'admin',
        role: 'admin',
        permissions: []
      },
      
      // 主题和语言设置
      theme: 'light',
      language: 'zh-CN',
      
      // 操作方法
      setUser: (user) => set({ user, isLoggedIn: true }),
      
      setToken: (token) => set({ token }),
      
      login: (userData) => set({
        user: userData.user,
        token: userData.token,
        isLoggedIn: true,
        userInfo: {
          id: userData.user?.id || '1',
          username: userData.user?.username || 'admin',
          role: userData.user?.role || 'admin',
          permissions: userData.user?.permissions || []
        }
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isLoggedIn: false,
        userInfo: {
          id: '1',
          username: 'admin',
          role: 'admin',
          permissions: []
        }
      }),
      
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates },
        userInfo: { ...state.userInfo, ...updates }
      })),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      setLanguage: (language) => set({ language }),
      
      // 初始化用户信息
      initializeUserInfo: () => {
        const userId = localStorage.getItem('userId') || '1'
        const username = localStorage.getItem('username') || 'admin'
        const userRole = localStorage.getItem('userRole') || 'admin'
        const permissions = localStorage.getItem('permissions')
        
        set({
          userInfo: {
            id: userId,
            username,
            role: userRole,
            permissions: permissions ? JSON.parse(permissions) : []
          }
        })
      },
      
      // 获取当前状态
      getCurrentState: () => get()
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      // 部分持久化
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        theme: state.theme,
        language: state.language
      })
    }
  )
)

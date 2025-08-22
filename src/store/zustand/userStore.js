import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getUserInfo } from '@/api/userInfo'

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
      
      login: async (userData) => {
        // 立即设置登录状态
        set({
          user: userData.user,
          token: userData.token,
          isLoggedIn: true
        })
        
        // 登录后立即获取用户详细信息
        try {
          const userInfoResponse = await getUserInfo()
          const userInfoData = userInfoResponse.data?.data
          
          if (userInfoData) {
            set({
              userInfo: {
                id: userInfoData.username || userData.user?.id || '1',
                username: userInfoData.username || userData.user?.username || 'admin',
                name: userInfoData.name || '',
                mobile: userInfoData.mobile || '',
                role: userInfoData.role || 'admin',
                department: userInfoData.department || '',
                orgName: userInfoData.orgName || '',
                orgCode: userInfoData.orgCode || '',
                userGroupName: userInfoData.userGroupName || '',
                authorityName: userInfoData.authorityName || '',
                permissions: userInfoData.authorities || [],
                menus: userInfoData.menus || [],
                isEvar: userInfoData.isEvar || false
              }
            })
            console.log('✅ 用户信息已更新:', userInfoData)
          }
        } catch (error) {
          console.error('❌ 获取用户信息失败:', error)
          // 失败时使用基础信息
          set({
            userInfo: {
              id: userData.user?.id || '1',
              username: userData.user?.username || 'admin',
              role: userData.user?.role || 'admin',
              permissions: userData.user?.permissions || []
            }
          })
        }
      },
      
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
      
      // 获取用户信息
      fetchUserInfo: async () => {
        try {
          console.log('🔄 正在获取用户信息...')
          const userInfoResponse = await getUserInfo()
          const userInfoData = userInfoResponse.data?.data
          
          if (userInfoData) {
            set((state) => ({
              userInfo: {
                id: userInfoData.username || state.userInfo?.id || '1',
                username: userInfoData.username || state.userInfo?.username || 'admin',
                name: userInfoData.name || '',
                mobile: userInfoData.mobile || '',
                role: userInfoData.role || 'admin',
                department: userInfoData.department || '',
                orgName: userInfoData.orgName || '',
                orgCode: userInfoData.orgCode || '',
                userGroupName: userInfoData.userGroupName || '',
                authorityName: userInfoData.authorityName || '',
                permissions: userInfoData.authorities || [],
                menus: userInfoData.menus || [],
                isEvar: userInfoData.isEvar || false
              }
            }))
            console.log('✅ 用户信息获取成功:', userInfoData)
            return userInfoData
          }
        } catch (error) {
          console.error('❌ 获取用户信息失败:', error)
          throw error
        }
      },

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

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // 布局设置
      layout: {
        sidebarCollapsed: false,
        sidebarWidth: 200,
        headerHeight: 64,
        footerHeight: 48
      },
      
      // 系统设置
      system: {
        autoSave: true,
        notifications: true,
        soundEnabled: false,
        animationEnabled: true
      },
      
      // 界面设置
      ui: {
        compactMode: false,
        showBreadcrumb: true,
        showPageTitle: true,
        showBackToTop: true
      },
      
      // 操作方法
      toggleSidebar: () => set((state) => ({
        layout: {
          ...state.layout,
          sidebarCollapsed: !state.layout.sidebarCollapsed
        }
      })),
      
      setSidebarWidth: (width) => set((state) => ({
        layout: {
          ...state.layout,
          sidebarWidth: width
        }
      })),
      
      updateSystemSettings: (settings) => set((state) => ({
        system: { ...state.system, ...settings }
      })),
      
      updateUISettings: (settings) => set((state) => ({
        ui: { ...state.ui, ...settings }
      })),
      
      resetSettings: () => set({
        layout: {
          sidebarCollapsed: false,
          sidebarWidth: 200,
          headerHeight: 64,
          footerHeight: 48
        },
        system: {
          autoSave: true,
          notifications: true,
          soundEnabled: false,
          animationEnabled: true
        },
        ui: {
          compactMode: false,
          showBreadcrumb: true,
          showPageTitle: true,
          showBackToTop: true
        }
      }),
      
      // 获取当前状态
      getCurrentState: () => get()
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
      // 部分持久化
      partialize: (state) => ({
        layout: state.layout,
        system: state.system,
        ui: state.ui
      })
    }
  )
)

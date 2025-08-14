import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useKeepAliveTestStore = create(
  persist(
    (set, get) => ({
      // 状态
      testData: {
        counter: 0,
        inputValue: '',
        timestamp: Date.now(),
        randomNumber: Math.floor(Math.random() * 1000),
        clicks: 0
      },
      pageLoads: 0,
      lastVisit: null,
      keepAliveStatus: '检查中...',
      
      // 操作方法
      updateTestData: (key, value) => 
        set((state) => ({
          testData: { ...state.testData, [key]: value }
        })),
      
      incrementCounter: () =>
        set((state) => ({
          testData: {
            ...state.testData,
            counter: state.testData.counter + 1,
            clicks: state.testData.clicks + 1
          }
        })),
      
      resetData: () =>
        set((state) => ({
          testData: {
            counter: 0,
            inputValue: '',
            timestamp: Date.now(),
            randomNumber: Math.floor(Math.random() * 1000),
            clicks: 0
          },
          pageLoads: 0
        })),
      
      setPageLoads: (count) => set({ pageLoads: count }),
      setLastVisit: (time) => set({ lastVisit: time }),
      setKeepAliveStatus: (status) => set({ keepAliveStatus: status }),
      
      // 批量更新
      updateMultipleData: (updates) =>
        set((state) => ({
          testData: { ...state.testData, ...updates }
        })),
      
      // 生成新的随机数
      generateNewRandomNumber: () =>
        set((state) => ({
          testData: {
            ...state.testData,
            randomNumber: Math.floor(Math.random() * 1000)
          }
        })),
      
      // 获取当前状态（用于调试）
      getCurrentState: () => get(),
      
      // 重置所有数据
      resetAllData: () =>
        set({
          testData: {
            counter: 0,
            inputValue: '',
            timestamp: Date.now(),
            randomNumber: Math.floor(Math.random() * 1000),
            clicks: 0
          },
          pageLoads: 0,
          lastVisit: null,
          keepAliveStatus: '检查中...'
        })
    }),
    {
      name: 'keep-alive-test-storage',
      storage: createJSONStorage(() => localStorage),
      // 部分持久化（只保存关键数据）
      partialize: (state) => ({
        testData: state.testData,
        pageLoads: state.pageLoads,
        lastVisit: state.lastVisit
      })
    }
  )
)

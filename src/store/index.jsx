import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice.js'
import settingsReducer from './slices/settingsSlice.js'
import { createPersistMiddleware } from './persist.js'

export const store = configureStore({
  reducer: {
    user: userReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略某些 action 的序列化检查
        ignoredActions: ['persist/REHYDRATE'],
        ignoredPaths: ['user.user', 'settings.layout']
      },
    }).concat(
      // 添加自动持久化中间件
      createPersistMiddleware(['user', 'settings'])
    ),
  // 启用 Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
})

// 导出类型（如果使用 TypeScript）
// 注意：在.jsx文件中使用JSDoc注释来提供类型信息
/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */
/**
 * @typedef {typeof store.dispatch} AppDispatch
 */ 
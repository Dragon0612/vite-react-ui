import { configureStore } from '@reduxjs/toolkit'

// 创建一个简单的默认 reducer
const defaultReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const store = configureStore({
  reducer: {
    app: defaultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}) 
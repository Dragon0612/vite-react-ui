import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

// 这里可以添加你的reducers
// import userReducer from './slices/userSlice'
// import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    // user: userReducer,
    // auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
} 
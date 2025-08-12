import { createSlice } from '@reduxjs/toolkit'

const keepAliveSlice = createSlice({
  name: 'keepAlive',
  initialState: {
    cachedPages: [],
    activePages: [],
    maxCache: 10,
    config: {
      include: [],
      exclude: ['/login'],
      scrollRestoration: true,
      autoCleanup: true
    },
    pageMetadata: {},
    loading: false,
    error: null
  },
  reducers: {
    addCachedPage: (state, action) => {
      const { path, metadata = {} } = action.payload
      
      if (!state.cachedPages.includes(path)) {
        state.cachedPages.push(path)
        state.pageMetadata[path] = {
          cachedAt: Date.now(),
          accessCount: 0,
          lastAccess: Date.now(),
          ...metadata
        }
        
        if (state.cachedPages.length > state.maxCache) {
          const oldestPage = state.cachedPages.shift()
          delete state.pageMetadata[oldestPage]
        }
      }
    },
    
    removeCachedPage: (state, action) => {
      const path = action.payload
      const index = state.cachedPages.indexOf(path)
      
      if (index > -1) {
        state.cachedPages.splice(index, 1)
        delete state.pageMetadata[path]
      }
      
      const activeIndex = state.activePages.indexOf(path)
      if (activeIndex > -1) {
        state.activePages.splice(activeIndex, 1)
      }
    },
    
    clearAllCache: (state) => {
      state.cachedPages = []
      state.activePages = []
      state.pageMetadata = {}
    },
    
    activatePage: (state, action) => {
      const path = action.payload
      
      if (!state.activePages.includes(path)) {
        state.activePages.push(path)
      }
      
      if (state.pageMetadata[path]) {
        state.pageMetadata[path].accessCount += 1
        state.pageMetadata[path].lastAccess = Date.now()
      }
    },
    
    updateConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload }
    },
    
    setMaxCache: (state, action) => {
      state.maxCache = action.payload
      
      if (state.cachedPages.length > state.maxCache) {
        const toRemove = state.cachedPages.length - state.maxCache
        state.cachedPages.splice(0, toRemove)
      }
    }
  }
})

export const {
  addCachedPage,
  removeCachedPage,
  clearAllCache,
  activatePage,
  updateConfig,
  setMaxCache
} = keepAliveSlice.actions

export const selectKeepAliveState = (state) => state.keepAlive
export const selectCachedPages = (state) => state.keepAlive.cachedPages
export const selectActivePages = (state) => state.keepAlive.activePages
export const selectKeepAliveConfig = (state) => state.keepAlive.config

export default keepAliveSlice.reducer

# 状态管理文档

## 📋 **概述**

本项目使用 **Zustand** 作为统一的状态管理解决方案，提供轻量级、高性能的状态管理功能。

## 🏗️ **架构设计**

### **状态结构**

```
src/store/
├── zustand/                 # Zustand 状态管理
│   ├── userStore.js        # 用户状态管理
│   ├── settingsStore.js    # 设置状态管理
│   ├── keepAliveTestStore.js # KeepAlive测试状态
│   ├── index.js            # 统一导出
│   ├── hooks.js            # 自定义hooks
│   └── utils.js            # 工具函数
├── hooks.js                # 兼容性hooks
└── utils.js                # 状态工具函数
```

## 🔧 **核心Store**

### **1. 用户状态管理 (userStore)**

```javascript
import { useUserStore } from '@/store/zustand'

// 在组件中使用
const { userInfo, isLoggedIn, login, logout } = useUserStore()
```

**状态结构:**
```javascript
{
  user: null,              // 用户基本信息
  token: null,             // 认证令牌
  isLoggedIn: false,       // 登录状态
  userInfo: {              // 用户详细信息
    id: '1',
    username: 'admin',
    role: 'admin',
    permissions: []
  },
  theme: 'light',          // 主题设置
  language: 'zh-CN'        // 语言设置
}
```

**主要方法:**
- `login(userData)` - 用户登录
- `logout()` - 用户登出
- `updateUser(updates)` - 更新用户信息
- `toggleTheme()` - 切换主题
- `setLanguage(language)` - 设置语言
- `initializeUserInfo()` - 初始化用户信息

### **2. 设置状态管理 (settingsStore)**

```javascript
import { useSettingsStore } from '@/store/zustand'

// 在组件中使用
const { layout, system, ui, toggleSidebar } = useSettingsStore()
```

**状态结构:**
```javascript
{
  layout: {                // 布局设置
    sidebarCollapsed: false,
    sidebarWidth: 200,
    headerHeight: 64,
    footerHeight: 48
  },
  system: {                // 系统设置
    autoSave: true,
    notifications: true,
    soundEnabled: false,
    animationEnabled: true
  },
  ui: {                    // 界面设置
    compactMode: false,
    showBreadcrumb: true,
    showPageTitle: true,
    showBackToTop: true
  }
}
```

**主要方法:**
- `toggleSidebar()` - 切换侧边栏
- `updateSystemSettings(settings)` - 更新系统设置
- `updateUISettings(settings)` - 更新界面设置
- `resetSettings()` - 重置设置

## 🎯 **使用指南**

### **基本使用**

```javascript
import { useUserStore, useSettingsStore } from '@/store/zustand'

function MyComponent() {
  // 用户状态
  const { userInfo, isLoggedIn, login, logout } = useUserStore()
  
  // 设置状态
  const { layout, toggleSidebar } = useSettingsStore()
  
  const handleLogin = () => {
    login({
      user: { username: 'admin', role: 'admin' },
      token: 'mock-token'
    })
  }
  
  return (
    <div>
      <p>当前用户: {userInfo.username}</p>
      <button onClick={handleLogin}>登录</button>
      <button onClick={toggleSidebar}>切换侧边栏</button>
    </div>
  )
}
```

### **状态持久化**

所有状态都自动持久化到 localStorage：

```javascript
// 用户状态持久化到 'user-storage'
// 设置状态持久化到 'settings-storage'

// 手动访问持久化数据
const userState = localStorage.getItem('user-storage')
const settingsState = localStorage.getItem('settings-storage')
```

### **选择性订阅**

```javascript
// 只订阅需要的状态，避免不必要的重渲染
const username = useUserStore(state => state.userInfo.username)
const sidebarCollapsed = useSettingsStore(state => state.layout.sidebarCollapsed)
```

## 🛠️ **开发工具**

### **Zustand DevTools**

在开发环境下，可以通过以下方式调试状态：

```javascript
// 在浏览器控制台中
console.log('用户状态:', useUserStore.getState())
console.log('设置状态:', useSettingsStore.getState())

// 或者通过全局变量访问
console.log('所有Store:', window.__zustandStores)
```

### **状态验证**

```javascript
import { stateValidation } from '@/store/utils'

// 验证用户状态
const isUserValid = stateValidation.validateUserState(userState)

// 验证设置状态
const isSettingsValid = stateValidation.validateSettingsState(settingsState)

// 验证完整状态
const validationResult = stateValidation.validateAllState({
  user: userState,
  settings: settingsState
})
```

## 🔍 **调试技巧**

### **1. 查看持久化状态**

```javascript
// 在浏览器控制台中
console.log('用户状态:', localStorage.getItem('user-storage'))
console.log('设置状态:', localStorage.getItem('settings-storage'))
```

### **2. 手动清除状态**

```javascript
// 清除特定状态
localStorage.removeItem('user-storage')
localStorage.removeItem('settings-storage')

// 清除所有状态
localStorage.clear()
```

### **3. 状态统计**

```javascript
import { stateUtils } from '@/store/utils'

const stats = stateUtils.getStateStats()
console.log('状态统计:', stats)
```

## ⚠️ **注意事项**

1. **存储限制**: localStorage 有存储大小限制（通常 5-10MB）
2. **序列化**: 只能存储可序列化的数据，函数、Symbol 等无法存储
3. **安全性**: 敏感信息（如密码）不应存储在 localStorage 中
4. **兼容性**: 确保目标浏览器支持 localStorage

## 🚀 **扩展建议**

### **1. 添加加密支持**

```javascript
// 加密敏感数据
const encryptedData = encrypt(JSON.stringify(sensitiveData))
localStorage.setItem('encrypted', encryptedData)
```

### **2. 添加过期时间**

```javascript
const dataWithExpiry = {
  data: actualData,
  expiry: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
}
```

### **3. 添加压缩支持**

```javascript
// 使用 LZ-string 压缩数据
import LZString from 'lz-string'

const compressed = LZString.compress(JSON.stringify(largeData))
localStorage.setItem('compressed', compressed)
```

## 📚 **相关资源**

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [localStorage API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React Hooks 文档](https://reactjs.org/docs/hooks-intro.html)

## 🤝 **贡献**

如果您有改进建议或发现问题，欢迎提交 Issue 或 Pull Request。

# 状态持久化解决方案

## 🎯 **概述**

这是一个基于 Redux Toolkit 的轻量级状态持久化解决方案，使用 localStorage 实现状态自动保存和恢复。

## ✨ **特性**

- 🚀 **轻量级**: 无需额外依赖，使用原生 localStorage
- 🔄 **自动持久化**: 状态变更后自动保存到 localStorage
- 📱 **响应式**: 支持状态导入/导出、验证、统计等功能
- 🛡️ **类型安全**: 提供便捷的 hooks 和工具函数
- 🎨 **易于使用**: 简单的 API 设计，快速上手

## 📁 **文件结构**

```
src/store/
├── index.jsx              # Store 主配置文件
├── StoreProvider.jsx      # Redux Provider 组件
├── persist.js             # 持久化核心工具
├── hooks.js               # 便捷的 hooks
├── utils.js               # 状态管理工具函数
├── slices/                # 状态切片
│   ├── userSlice.js       # 用户状态管理
│   └── settingsSlice.js   # 应用设置管理
└── README.md              # 使用说明
```

## 🚀 **快速开始**

### 1. **基本使用**

```jsx
import { useUser, useAppDispatch } from '@/store/hooks'
import { login, logout } from '@/store/slices/userSlice'

const MyComponent = () => {
  const dispatch = useAppDispatch()
  const user = useUser()
  
  const handleLogin = () => {
    dispatch(login({
      user: { username: 'test' },
      token: 'token123'
    }))
  }
  
  const handleLogout = () => {
    dispatch(logout())
  }
  
  return (
    <div>
      {user.isLoggedIn ? (
        <button onClick={handleLogout}>登出</button>
      ) : (
        <button onClick={handleLogin}>登录</button>
      )}
    </div>
  )
}
```

### 2. **使用便捷 Hooks**

```jsx
import { 
  useUserInfo, 
  useIsLoggedIn, 
  useTheme, 
  useSidebarCollapsed 
} from '@/store/hooks'

const Header = () => {
  const user = useUserInfo()
  const isLoggedIn = useIsLoggedIn()
  const theme = useTheme()
  const sidebarCollapsed = useSidebarCollapsed()
  
  return (
    <header>
      <span>欢迎, {user?.username}</span>
      <span>主题: {theme}</span>
      <span>侧边栏: {sidebarCollapsed ? '折叠' : '展开'}</span>
    </header>
  )
}
```

## 🔧 **核心 API**

### **persistState 工具**

```javascript
import { persistState } from '@/store/persist'

// 保存状态
persistState.save('user', userData)

// 加载状态
const userData = persistState.load('user', defaultValue)

// 清除状态
persistState.remove('user')

// 清除所有状态
persistState.clear()
```

### **状态管理工具**

```javascript
import { stateUtils, stateValidation } from '@/store/utils'

// 导出状态到文件
stateUtils.exportState()

// 从文件导入状态
await stateUtils.importState(file)

// 获取状态统计
const stats = stateUtils.getStateStats()

// 验证状态完整性
const isValid = stateValidation.validateAllState(state)
```

## 📊 **状态切片**

### **用户状态 (userSlice)**

管理用户认证、个人信息、偏好设置等：

- `user`: 用户信息对象
- `token`: 认证令牌
- `isLoggedIn`: 登录状态
- `theme`: 主题设置
- `language`: 语言设置

### **应用设置 (settingsSlice)**

管理应用级别的配置和偏好：

- `sidebarCollapsed`: 侧边栏折叠状态
- `breadcrumbVisible`: 面包屑显示状态
- `pageSize`: 分页大小
- `autoSave`: 自动保存开关
- `notifications`: 通知设置
- `layout`: 布局配置

## 🔄 **自动持久化**

状态会在以下情况下自动保存：

1. **状态变更**: 通过 reducer 更新状态时
2. **中间件触发**: 自动持久化中间件监听状态变化
3. **手动触发**: 调用 `persistState.save()` 方法

## 🎨 **主题和语言支持**

```jsx
import { useTheme, useLanguage } from '@/store/hooks'
import { toggleTheme, setLanguage } from '@/store/slices/userSlice'

const ThemeSwitcher = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const language = useLanguage()
  
  return (
    <div>
      <button onClick={() => dispatch(toggleTheme())}>
        当前主题: {theme}
      </button>
      <select onChange={(e) => dispatch(setLanguage(e.target.value))}>
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
  )
}
```

## 📱 **响应式设置**

```jsx
import { useSettings } from '@/store/hooks'
import { updateLayout } from '@/store/slices/settingsSlice'

const LayoutSettings = () => {
  const dispatch = useAppDispatch()
  const settings = useSettings()
  
  const handleResize = (width) => {
    dispatch(updateLayout({ sidebarWidth: width }))
  }
  
  return (
    <div>
      <input
        type="range"
        min="150"
        max="300"
        value={settings.layout.sidebarWidth}
        onChange={(e) => handleResize(Number(e.target.value))}
      />
    </div>
  )
}
```

## 🛠️ **开发工具**

### **Redux DevTools**

在开发环境下，Redux DevTools 会自动启用，方便调试状态变化。

### **状态验证**

```javascript
import { stateValidation } from '@/store/utils'

// 验证单个状态切片
const isUserValid = stateValidation.validateUserState(userState)
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
console.log('用户状态:', localStorage.getItem('user'))
console.log('设置状态:', localStorage.getItem('settings'))
```

### **2. 手动清除状态**

```javascript
// 清除特定状态
localStorage.removeItem('user')

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

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [localStorage API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)

## 🤝 **贡献**

如果您有改进建议或发现问题，欢迎提交 Issue 或 Pull Request。

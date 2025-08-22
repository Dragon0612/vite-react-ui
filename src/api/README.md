# API 接口文档

纯API调用层，负责与后端接口通信，不处理业务逻辑。

## 目录结构

- [`login.js`](./login.js) - 登录认证相关API
- [`userInfo.js`](./userInfo.js) - 用户信息相关API

---

## 登录相关API (`src/api/login.js`)

基于标准RESTful API的登录认证接口。

### 基础用法

```javascript
import { login, logout, register } from '@/api/login'
// 或者
import loginApi from '@/api/login'
```

### API 方法

所有方法都是直接的HTTP请求调用，返回Promise。

#### 1. 用户登录

```javascript
import { login } from '@/api/login'

const handleLogin = async () => {
  try {
    const response = await login({
      username: 'admin@example.com',
      password: 'password123',
      rememberMe: true
    })
    console.log('登录响应:', response)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

#### 2. 用户注册

```javascript
import { register } from '@/api/login'

const handleRegister = async () => {
  try {
    const response = await register({
      username: 'newuser',
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      nickname: '新用户',
      phone: '13800138000'
    })
    console.log('注册响应:', response)
  } catch (error) {
    console.error('注册失败:', error)
  }
}
```

#### 3. 用户登出

```javascript
import { logout } from '@/api/login'

const handleLogout = async () => {
  try {
    const response = await logout()
    console.log('登出响应:', response)
  } catch (error) {
    console.error('登出失败:', error)
  }
}
```

#### 4. 忘记密码

```javascript
import { forgotPassword } from '@/api/login'

const handleForgotPassword = async () => {
  try {
    const response = await forgotPassword('user@example.com')
    console.log('忘记密码响应:', response)
  } catch (error) {
    console.error('发送失败:', error)
  }
}
```

#### 5. 重置密码

```javascript
import { resetPassword } from '@/api/login'

const handleResetPassword = async () => {
  try {
    const response = await resetPassword({
      token: 'reset-token-from-email',
      password: 'newpassword123',
      confirmPassword: 'newpassword123'
    })
    console.log('重置密码响应:', response)
  } catch (error) {
    console.error('重置失败:', error)
  }
}
```

#### 6. 修改密码

```javascript
import { changePassword } from '@/api/login'

const handleChangePassword = async () => {
  try {
    const response = await changePassword({
      oldPassword: 'oldpassword123',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    })
    console.log('修改密码响应:', response)
  } catch (error) {
    console.error('修改失败:', error)
  }
}
```

#### 7. 获取用户信息

```javascript
import { getUserInfo } from '@/api/login'

const fetchUserInfo = async () => {
  try {
    const response = await getUserInfo()
    console.log('用户信息:', response)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
```

#### 8. 更新用户信息

```javascript
import { updateUserInfo } from '@/api/login'

const updateUser = async () => {
  try {
    const response = await updateUserInfo({
      nickname: '新昵称',
      email: 'newemail@example.com'
    })
    console.log('更新响应:', response)
  } catch (error) {
    console.error('更新失败:', error)
  }
}
```

#### 9. 刷新Token

```javascript
import { refreshToken } from '@/api/login'

const handleRefreshToken = async () => {
  try {
    const response = await refreshToken()
    console.log('刷新Token响应:', response)
  } catch (error) {
    console.error('刷新失败:', error)
  }
}
```

### API端点

所有API调用基于以下端点：

```javascript
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  USER_INFO: '/auth/user'
}
```

### 环境配置

API基础URL通过环境变量配置：

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production  
VITE_API_URL=https://api.yourdomain.com
```

### 使用原则

1. **纯API调用**: 此模块只负责HTTP请求，不处理业务逻辑
2. **错误处理**: 在调用层面处理try/catch，业务逻辑在组件或service层处理
3. **返回原始响应**: 直接返回axios响应，不做额外包装
4. **统一接口**: 所有认证相关的API调用都集中在此文件

### 与业务层配合

```javascript
// 在业务逻辑层处理API响应
import { login } from '@/api/login'

const authService = {
  async loginUser(credentials) {
    try {
      const response = await login(credentials)
      
      // 业务逻辑处理
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        // 触发事件、更新状态等
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data }
    }
  }
}
```

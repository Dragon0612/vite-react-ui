# Apifox登录接口使用指南

## 📋 概述

登录页面现在已配置为使用Apifox Mock登录接口，无需启动本地后端服务即可测试登录功能。

## 🎭 Apifox配置信息

### 项目信息
- **项目ID**: 6491710
- **项目名称**: Vite React UI 项目 API
- **Mock服务地址**: https://m1.apifoxmock.com/m1/6491710-6191887-default
- **认证Token**: shpT2Zh4YXB4oeDJ44Q47

### 登录接口
- **接口地址**: `GET /system/login`
- **完整URL**: https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login
- **请求方式**: GET (使用查询参数)
- **认证方式**: Bearer Token

## 🔑 测试账号

您可以使用以下测试账号进行登录：

### 管理员账号
- **用户名**: admin@example.com
- **密码**: admin123
- **角色**: 管理员

### 普通用户账号
- **用户名**: user@example.com
- **密码**: user123
- **角色**: 普通用户

### 测试账号
- **用户名**: test@example.com
- **密码**: test123
- **角色**: 测试用户

## 🚀 使用方法

### 1. 直接登录
1. 打开登录页面
2. 页面会自动检测Apifox服务连接状态
3. 输入上述任一测试账号的用户名和密码
4. 点击"使用Apifox登录"按钮
5. 登录成功后会跳转到主页面

### 2. 测试功能
登录页面提供了以下测试功能：

#### 重新检测按钮
- 手动重新检查Apifox服务连接状态
- 测试Mock服务是否可访问

#### 测试Apifox登录按钮
- 使用预设的管理员账号测试登录接口
- 在控制台查看详细的请求和响应信息
- 验证接口调用是否正常

## 📊 状态显示

登录页面会实时显示以下信息：

### 连接状态
- ✅ **连接正常**: Apifox Mock服务可正常访问
- ❌ **连接失败**: 网络问题或Apifox服务不可用

### 服务信息
- Apifox Mock服务地址
- 项目ID和认证Token
- 当前连接状态

## 🔍 调试功能

### 控制台日志
登录过程中会在浏览器控制台输出详细信息：
```javascript
🎭 开始Apifox登录...
📝 登录信息: {username: "admin@example.com", password: "admin123"}
🌐 Apifox地址: https://m1.apifoxmock.com/m1/6491710-6191887-default
✅ Apifox登录响应: {success: true, data: {...}}
```

### 网络请求
1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 进行登录操作
4. 查看发送到Apifox的请求详情

## 🎯 接口详情

### 请求格式
```http
GET /system/login?username=admin@example.com&password=admin123 HTTP/1.1
Host: m1.apifoxmock.com
Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47
apifoxToken: shpT2Zh4YXB4oeDJ44Q47
Content-Type: application/json
Accept: application/json
```

### 响应格式
#### 成功响应
```json
{
  "success": true,
  "data": {
    "token": "mock-jwt-token-xxx",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": ["read", "write", "admin"]
    }
  },
  "message": "登录成功"
}
```

#### 失败响应
```json
{
  "success": false,
  "message": "用户名或密码错误",
  "error": {
    "code": "INVALID_CREDENTIALS"
  }
}
```

## ⚠️ 注意事项

### 1. Mock数据特性
- Apifox Mock返回的是模拟数据
- Token是虚拟的，仅用于测试
- 用户信息是预定义的测试数据

### 2. 网络依赖
- 需要网络连接访问Apifox服务
- 如果网络受限，可能无法访问Mock服务

### 3. CORS支持
- Apifox Mock服务已配置CORS
- 支持跨域请求，无需额外配置

## 🛠️ 故障排除

### 连接失败
如果显示"❌ 连接失败"，请检查：
1. 网络连接是否正常
2. 是否能访问外部网站
3. 防火墙是否阻止了请求

### 登录失败
如果登录失败，请：
1. 确认使用的是正确的测试账号
2. 检查控制台错误信息
3. 点击"测试Apifox登录"按钮进行诊断

### 请求超时
如果请求超时：
1. 检查网络连接速度
2. 尝试刷新页面重新连接
3. 稍后再试

## 🔗 相关链接

- **Apifox项目地址**: https://app.apifox.com/project/6491710
- **Mock服务文档**: 查看项目中的Apifox接口文档
- **技术支持**: 如有问题请查看控制台日志或联系开发团队

## 💡 开发提示

### 切换到真实API
如需切换回真实后端API，可以：
1. 修改 `src/pages/login/index.jsx` 中的导入
2. 将 `loginToApifox` 改回 `loginApi`
3. 更新API配置为真实后端地址

### 自定义Mock数据
如需修改Mock数据：
1. 访问Apifox项目
2. 编辑登录接口的Mock规则
3. 保存后即时生效

这样您就可以无需启动后端服务，直接使用Apifox进行登录功能测试了！

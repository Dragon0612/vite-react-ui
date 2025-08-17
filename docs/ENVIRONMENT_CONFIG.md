# 环境配置指南

## 📋 概述

本项目支持多环境配置，包括开发环境、测试环境和生产环境。

## 🔧 环境文件

### 1. 开发环境 (.env.development)
```bash
# 开发环境配置
NODE_ENV=development
VITE_APP_TITLE=Vite React UI - 开发环境
VITE_APP_ENV=development

# API 配置
VITE_API_BASE_URL=http://localhost:8080

# 功能开关
VITE_ENABLE_MOCK=true
VITE_ENABLE_DEBUG=true

# 性能配置
VITE_ENABLE_SOURCEMAP=true
VITE_ENABLE_COMPRESSION=false
VITE_ENABLE_ANALYZE=false

# 其他配置
VITE_APP_PORT=3000
VITE_APP_HOST=0.0.0.0
```

### 2. 测试环境 (.env.test)
```bash
# 测试环境配置
NODE_ENV=test
VITE_APP_TITLE=Vite React UI - 测试环境
VITE_APP_ENV=test

# API 配置
VITE_API_BASE_URL=https://test-api.yourdomain.com

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=true

# 性能配置
VITE_ENABLE_SOURCEMAP=true
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_ANALYZE=true

# 其他配置
VITE_APP_PORT=3000
VITE_APP_HOST=0.0.0.0
```

### 3. 生产环境 (.env.production)
```bash
# 生产环境配置
NODE_ENV=production
VITE_APP_TITLE=Vite React UI - 生产环境
VITE_APP_ENV=production

# API 配置
VITE_API_BASE_URL=https://api.yourdomain.com

# 功能开关
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=false

# 性能配置
VITE_ENABLE_SOURCEMAP=false
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_ANALYZE=false
```

## 🚀 启动命令

### 开发环境
```bash
# 开发环境启动
yarn dev
# 或
yarn dev:dev

# 测试环境启动
yarn dev:test

# 生产环境启动
yarn dev:prod
```

### 构建命令
```bash
# 生产环境构建
yarn build

# 测试环境构建
yarn build:test

# 开发环境构建
yarn build:dev
```

## 📊 环境变量使用

### 在代码中使用
```javascript
// 获取环境变量
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
const mode = import.meta.env.MODE
```

### 在 Vite 配置中使用
```javascript
// vite.config.js
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080'
        }
      }
    }
  }
})
```

## 🎯 环境特点

| 环境 | 特点 | 用途 |
|------|------|------|
| **开发环境** | 启用调试、Mock、SourceMap | 本地开发调试 |
| **测试环境** | 启用调试、压缩、分析 | 功能测试验证 |
| **生产环境** | 禁用调试、启用压缩 | 线上部署 |

## 🔍 环境检测

```javascript
// 环境检测函数
const isDevelopment = () => import.meta.env.MODE === 'development'
const isTest = () => import.meta.env.MODE === 'test'
const isProduction = () => import.meta.env.MODE === 'production'

// 使用示例
if (isDevelopment()) {
  console.log('开发环境')
} else if (isTest()) {
  console.log('测试环境')
} else {
  console.log('生产环境')
}
```

## 🚨 注意事项

1. **环境变量前缀**: Vite 只暴露以 `VITE_` 开头的环境变量
2. **文件命名**: 环境文件必须以 `.env` 开头
3. **优先级**: 特定环境的文件会覆盖通用文件
4. **安全性**: 不要在环境文件中存储敏感信息

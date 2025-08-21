# 绝对路径导入配置

本项目已配置绝对路径导入，可以使用 `@/` 前缀来简化导入路径。

## 📁 配置位置

### 1. Vite 配置 (`vite.config.js`)

```javascript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ... 其他配置
})
```

### 2. IDE 配置 (`jsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    // ... 其他配置
  }
}
```

## 🚀 使用方法

### 导入组件
```javascript
// 之前
import Home from '../pages/Home'
import About from '../pages/About'

// 现在
import Home from '@/pages/Home'
import About from '@/pages/About'
```

### 导入工具函数
```javascript
// 之前
import { get, post } from '../utils/request'

// 现在
import { get, post } from '@/utils/request'
```

### 导入自定义 Hooks
```javascript
// 之前
import { useRequest } from '../hooks/useRequest'

// 现在
import { useRequest } from '@/hooks/useRequest'
```

### 导入服务层
```javascript
// 之前
import { userService } from '../services/api/services/UserService'

// 现在
import { userService } from '@/services'
```

### 导入样式文件
```javascript
// 之前
import './styles/global.less'

// 现在
import '@/styles/global.less'
```

## ✅ 优势

1. **避免复杂路径**：不再需要写 `../../../` 这样的相对路径
2. **文件移动友好**：移动文件时不需要修改导入路径
3. **IDE 支持**：更好的智能提示和自动补全
4. **代码清晰**：导入路径更直观易读
5. **维护性**：减少路径错误和维护成本

## 📋 使用建议

### 推荐使用绝对路径的场景：
- 导入页面组件 (`@/pages/`)
- 导入工具函数 (`@/utils/`)
- 导入自定义 Hooks (`@/hooks/`)
- 导入服务层 (`@/services/`)
- 导入全局样式 (`@/styles/`)
- 导入静态资源 (`@/assets/`)

### 相对路径仍可使用的场景：
- 同一目录下的文件
- 子目录中的文件
- 临时性的导入

## 🔧 已更新的文件

以下文件已更新为使用绝对路径导入：

- `src/App.jsx`
- `src/main.jsx`
- `src/pages/Home.jsx`
- `src/components/RequestDemo.jsx`
- `src/components/UserList.jsx`
- `src/services/api/services/UserService.js`
- `src/services/api/services/AuthService.js`

## 🎯 演示页面

访问 `http://localhost:5174/path-alias-demo` 查看详细的使用示例和说明。

## ⚠️ 注意事项

1. 确保 IDE 已加载 `jsconfig.json` 配置
2. 重启开发服务器以确保配置生效
3. 如果使用 TypeScript，可以创建 `tsconfig.json` 替代 `jsconfig.json` 
# 路由配置说明

本项目使用集中式的路由配置管理，所有路由都在 `src/router/index.js` 中定义。

## 📁 文件结构

```
src/router/
├── index.js          # 路由配置定义
├── RouterConfig.jsx  # 路由渲染组件
└── README.md         # 说明文档
```

## 🚀 使用方法

### 1. 添加新路由

在 `src/router/index.js` 中添加新的路由配置：

```javascript
{
  path: '/new-page',
  name: '新页面',
  component: lazy(() => import('@/pages/NewPage')),
  meta: {
    title: '新页面标题',
    icon: 'icon-name',
    showInMenu: true,
    requiresAuth: false
  }
}
```

### 2. 路由配置参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | string | 路由路径 |
| `name` | string | 路由名称 |
| `component` | Component | 懒加载的组件 |
| `meta.title` | string | 页面标题 |
| `meta.icon` | string | 菜单图标 |
| `meta.showInMenu` | boolean | 是否在菜单中显示 |
| `meta.requiresAuth` | boolean | 是否需要认证 |

### 3. 可用的工具函数

```javascript
import { 
  getMenuItems,    // 获取菜单项
  getRouteByPath,  // 根据路径获取路由配置
  getAllPaths,     // 获取所有路由路径
  requiresAuth     // 检查路由是否需要认证
} from '@/router'
```

## 🎯 特性

1. **懒加载**：所有组件都使用 `lazy()` 进行懒加载
2. **集中管理**：所有路由配置在一个文件中
3. **元数据支持**：每个路由可以配置标题、图标、权限等
4. **自动菜单**：根据路由配置自动生成导航菜单
5. **加载状态**：路由切换时显示加载动画

## 📋 图标映射

在 `src/components/Navigation.jsx` 中定义了图标映射：

```javascript
const iconMap = {
  home: <HomeOutlined />,
  info: <InfoCircleOutlined />,
  'ant-design': <AntDesignOutlined />,
  style: <BgColorsOutlined />,
  api: <ApiOutlined />,
  user: <UserOutlined />
}
```

## ⚠️ 注意事项

1. 新添加的组件必须使用 `lazy()` 包装
2. 路由路径必须以 `/` 开头
3. 确保组件文件存在且路径正确
4. 图标名称必须在 `iconMap` 中定义 
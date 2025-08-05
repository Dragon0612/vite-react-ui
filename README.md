# Vite React UI - 后台管理框架

这是一个基于 Vite + React + Ant Design 的纯后台管理框架系统，提供了完整的后台管理基础架构。

## 主要特性

- 🚀 **Vite** - 快速的构建工具
- ⚛️ **React 19** - 最新的 React 版本
- 🎨 **Ant Design** - 企业级 UI 组件库
- 🛣️ **React Router** - 路由管理
- 📦 **Redux Toolkit** - 状态管理
- 🎯 **TypeScript 支持** - 完整的类型支持
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🔐 **权限控制** - 基于路由的权限管理
- 🎨 **主题定制** - 支持主题切换和定制

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── Layout.jsx      # 后台布局组件
│   └── Button.jsx      # 通用按钮组件
├── pages/              # 页面组件
│   ├── Dashboard.jsx   # 仪表盘页面
│   └── Login.jsx       # 登录页面
├── router/             # 路由配置
│   ├── index.js        # 路由定义
│   └── RouterConfig.jsx # 路由配置组件
├── store/              # 状态管理
│   └── index.jsx       # Redux store 配置
├── hooks/              # 自定义 Hooks
│   └── useLocalStorage.js # 本地存储 Hook
├── styles/             # 样式文件
│   ├── global.less     # 全局样式
│   ├── variables.less  # 样式变量
│   └── mixins.less     # 样式混入
└── services/           # 服务层
    └── index.js        # 服务导出
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 框架特性

### 1. 路由管理
- 基于 React Router 的路由系统
- 支持嵌套路由和懒加载
- 路由权限控制

### 2. 状态管理
- 使用 Redux Toolkit 进行状态管理
- 模块化的 reducer 设计
- 支持异步操作

### 3. 组件系统
- 基于 Ant Design 的组件库
- 响应式布局设计
- 可复用的组件结构

### 4. 样式系统
- Less 预处理器
- 全局样式变量
- 主题定制支持

### 5. 开发工具
- ESLint 代码规范
- Vite 快速构建
- 热更新支持

## 扩展指南

### 添加新页面
1. 在 `src/pages/` 目录下创建新页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/components/Layout.jsx` 中添加菜单项

### 添加新服务
1. 在 `src/services/` 目录下创建服务文件
2. 在 `src/services/index.js` 中导出服务

### 添加新组件
1. 在 `src/components/` 目录下创建组件
2. 遵循组件设计规范

### 添加新 Hook
1. 在 `src/hooks/` 目录下创建自定义 Hook
2. 遵循 React Hooks 规范

## 技术栈

- **构建工具**: Vite
- **前端框架**: React 19
- **UI 组件库**: Ant Design 4.24.0
- **路由管理**: React Router DOM
- **状态管理**: Redux Toolkit
- **样式预处理**: Less
- **代码规范**: ESLint

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

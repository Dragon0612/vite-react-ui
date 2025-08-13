# Vite React UI - 后台管理框架

这是一个基于 **Vite + React + Ant Design** 的现代化后台管理框架系统，提供了完整的后台管理基础架构和丰富的功能特性。

## 🚀 主要特性

- ⚡ **Vite 7** - 极速的构建工具和开发体验
- ⚛️ **React 18** - 稳定的 React 版本，支持最新特性
- 🎨 **Ant Design 5** - 企业级 UI 组件库，支持主题定制
- 🛣️ **React Router 7** - 现代化的路由管理系统
- 📦 **Redux Toolkit** - 高效的状态管理解决方案
- 🔄 **KeepAlive** - 智能页面缓存系统，提升用户体验
- 🌐 **API 架构** - 完整的 HTTP 客户端和中间件系统
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🔐 **权限控制** - 基于路由的权限管理系统
- 🎨 **主题系统** - 支持主题切换和深度定制
- 🧹 **代码规范** - ESLint 9 + 现代化代码规范


## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

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

### 代码检查

```bash
npm run lint
# 或
yarn lint
```

## 🎯 核心功能

### 1. 🛣️ 路由管理系统
- 基于 React Router 7 的现代化路由系统
- 支持嵌套路由和懒加载
- 路由权限控制和元数据配置
- 智能菜单生成和分组

### 2. 📦 状态管理
- 使用 Redux Toolkit 进行高效状态管理
- 模块化的 slice 设计
- 支持异步操作和中间件
- 状态持久化支持

### 3. 🔄 KeepAlive 缓存系统
- 智能页面缓存，避免重复渲染
- 状态保持和滚动位置恢复
- 自动缓存管理和清理
- 可视化缓存管理面板

### 4. 🌐 API 架构系统
- 完整的 HTTP 客户端管理
- 中间件系统支持
- 统一的错误处理和拦截器
- 支持多种环境配置

### 5. 🎨 UI 组件系统
- 基于 Ant Design 5 的企业级组件
- 响应式布局设计
- 主题定制和切换支持
- 可复用的组件结构

### 6. 🎨 样式系统
- Less 预处理器支持
- 全局样式变量和混入
- 主题定制和动态切换
- Tailwind CSS 集成支持

## 🔧 扩展指南

### 添加新页面
1. 在 `src/pages/` 目录下创建新页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 配置页面元数据和权限

### 添加新服务
1. 在 `src/services/api/services/` 目录下创建服务文件
2. 继承 `BaseApiService` 类
3. 在 `src/services/api/index.js` 中导出服务

### 添加新组件
1. 在 `src/components/` 目录下创建组件
2. 遵循组件设计规范和命名约定
3. 添加必要的类型定义和文档

### 配置 KeepAlive
1. 在路由配置中添加 `keepAlive: true` 和 `cacheKey`
2. 使用 `useKeepAlive` Hook 管理缓存
3. 通过 `KeepAlivePanel` 监控缓存状态

## 🛠️ 技术栈

- **构建工具**: Vite 7.0.4
- **前端框架**: React 18.3.1
- **UI 组件库**: Ant Design 5.26.7
- **路由管理**: React Router DOM 7.7.1
- **状态管理**: Redux Toolkit 2.8.2 + React Redux 9.2.0
- **HTTP 客户端**: Axios 1.11.0
- **样式预处理**: Less 4.4.0 + Tailwind CSS 4.1.11
- **代码规范**: ESLint 9.30.1
- **开发工具**: PostCSS 8.5.6 + Autoprefixer 10.4.21

## 🌍 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 📚 相关文档

- [📖 完整文档索引](./docs/) - 所有技术文档和使用指南
- [🚀 API 集成指南](./docs/API_INTEGRATION_GUIDE.md) - API 架构使用指南
- [🔄 KeepAlive 使用指南](./docs/KEEPALIVE_README.md) - 缓存功能使用说明
- [🛠️ 路径别名配置](./docs/PATH_ALIAS_README.md) - 项目路径配置说明
- [🎨 Ant Design 使用指南](./docs/ANTD_README.md) - UI 组件库使用说明
- [👨‍💼 管理员指南](./docs/ADMIN_README.md) - 系统管理操作指南

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 支持

如果您在使用过程中遇到问题，请：

1. 查看相关文档
2. 搜索已有的 Issues
3. 创建新的 Issue 并详细描述问题

---

**享受开发！** 🎉

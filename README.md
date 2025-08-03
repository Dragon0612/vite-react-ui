# Vite React 项目

这是一个使用现代技术栈构建的React应用，集成了最新的开发工具和最佳实践。

## 🚀 技术栈

- **React 19** - 用户界面库
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **React Router** - 路由管理
- **Redux Toolkit** - 状态管理
- **Axios** - HTTP客户端
- **ESLint** - 代码检查

## 📁 项目结构

```
src/
├── components/     # 可复用组件
├── pages/         # 页面组件
├── store/         # Redux状态管理
├── hooks/         # 自定义Hooks
├── services/      # API服务
├── utils/         # 工具函数
├── types/         # TypeScript类型定义
└── assets/        # 静态资源
```

## 🛠️ 开发命令

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 预览构建结果
yarn preview

# 代码检查
yarn lint
```

## 🔧 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=Vite React App
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
```

## 📦 主要功能

- ✅ 热模块替换 (HMR)
- ✅ 路由管理
- ✅ 状态管理
- ✅ API请求封装
- ✅ 本地存储工具
- ✅ 自定义Hooks
- ✅ 响应式设计
- ✅ 代码检查

## 🎨 样式系统

项目使用Tailwind CSS作为样式框架，提供了：

- 响应式设计
- 实用优先的CSS类
- 自定义主题支持
- 组件化样式

## 🔄 状态管理

使用Redux Toolkit进行状态管理，提供了：

- 简化的Redux配置
- 内置的Immer支持
- 开发工具集成
- 异步操作支持

## 📡 API集成

使用Axios进行HTTP请求，提供了：

- 请求/响应拦截器
- 统一错误处理
- 认证token管理
- 超时配置

## 🚀 快速开始

1. 克隆项目
2. 安装依赖：`yarn install`
3. 启动开发服务器：`yarn dev`
4. 打开浏览器访问：`http://localhost:5173`

## 📝 开发指南

- 组件放在 `src/components/` 目录
- 页面放在 `src/pages/` 目录
- 自定义Hooks放在 `src/hooks/` 目录
- API服务放在 `src/services/` 目录
- 工具函数放在 `src/utils/` 目录

## 🤝 贡献

欢迎提交Issue和Pull Request！

## �� 许可证

MIT License

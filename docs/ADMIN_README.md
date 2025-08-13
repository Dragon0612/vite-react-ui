# 后台管理系统

这是一个基于 React + Vite + Ant Design 构建的现代化后台管理系统。

## 功能特性

### 🔐 认证系统
- 登录页面 (`/login`)
- 基于 localStorage 的简单认证
- 路由保护，未登录自动跳转到登录页

### 📊 核心功能模块

#### 1. 仪表盘 (`/`)
- 数据统计卡片
- 系统性能监控
- 最近订单列表
- 快速操作入口

#### 2. 数据分析 (`/analytics`)
- 访问量统计
- 销售额分析
- 订单数据
- 增长率显示

#### 3. 用户管理 (`/users`)
- 用户列表展示
- 用户搜索功能
- 添加/编辑/删除用户
- 用户状态管理
- 角色权限控制

#### 4. 商品管理 (`/products`)
- 商品列表
- 商品分类管理
- 价格和库存管理
- 商品状态控制

#### 5. 订单管理 (`/orders`)
- 订单列表
- 订单状态跟踪
- 支付方式显示
- 订单详情查看

#### 6. 内容管理 (`/content`)
- 文章管理
- 内容分类
- 发布状态控制
- 浏览量统计

#### 7. 系统设置 (`/settings`)
- 网站基本信息配置
- 功能开关设置
- 时区和语言设置
- 通知配置

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **UI 组件库**: Ant Design
- **路由管理**: React Router v6
- **状态管理**: 内置 Store
- **样式**: Less + CSS Modules
- **HTTP 请求**: Axios

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Layout.jsx      # 后台布局组件
│   └── Navigation.jsx  # 导航组件
├── pages/              # 页面组件
│   ├── Login.jsx       # 登录页面
│   ├── Dashboard.jsx   # 仪表盘
│   ├── Analytics.jsx   # 数据分析
│   ├── UserManagement.jsx    # 用户管理
│   ├── ProductManagement.jsx # 商品管理
│   ├── OrderManagement.jsx   # 订单管理
│   ├── ContentManagement.jsx # 内容管理
│   └── SystemSettings.jsx    # 系统设置
├── router/             # 路由配置
│   ├── index.js        # 路由定义
│   └── RouterConfig.jsx # 路由组件
├── services/           # 服务层
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
└── styles/             # 样式文件
```

## 路由配置

系统采用嵌套路由结构：

- `/login` - 登录页面
- `/` - 仪表盘（需要认证）
- `/analytics` - 数据分析
- `/users` - 用户管理
- `/products` - 商品管理
- `/orders` - 订单管理
- `/content` - 内容管理
- `/settings` - 系统设置

## 认证机制

- 使用 localStorage 存储 token
- 路由级别的认证保护
- 自动重定向到登录页
- 登录后自动跳转到仪表盘

## 布局设计

- 左侧固定侧边栏导航
- 顶部用户信息和通知
- 响应式设计，支持移动端
- 可折叠侧边栏

## 开发说明

### 启动项目
```bash
npm install
npm run dev
```

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 页面说明

每个页面都包含基本的 CRUD 操作界面：

1. **列表展示** - 使用 Ant Design Table 组件
2. **搜索功能** - 支持关键词搜索
3. **分页控制** - 标准分页组件
4. **操作按钮** - 编辑、删除、查看等操作
5. **状态管理** - 使用 React Hooks 管理状态

## 扩展功能

系统预留了以下扩展点：

- 权限管理系统
- 数据可视化图表
- 文件上传功能
- 消息通知系统
- 日志记录功能
- 数据导入导出

## 注意事项

- 当前使用模拟数据，实际使用时需要连接后端 API
- 认证机制较为简单，生产环境需要更安全的认证方案
- 样式可以根据实际需求进行调整
- 建议添加错误边界和加载状态处理 
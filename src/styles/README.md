# Less 样式系统使用指南

## 概述

这个项目使用 Less 预处理器来管理全局样式，提供了变量、混入和工具类的完整系统。

## 文件结构

```
src/styles/
├── variables.less    # 全局变量定义
├── mixins.less      # 可复用的样式混入
├── global.less      # 主样式文件
└── README.md        # 使用说明
```

## 核心特性

### 1. 变量系统

在 `variables.less` 中定义了全局变量：

```less
// 颜色变量
@primary-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #f5222d;

// 间距变量
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;
```

### 2. 混入系统

在 `mixins.less` 中定义了可复用的样式混入：

```less
// 弹性布局混入
.flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 按钮混入
.btn-primary() {
  .btn-base();
  background-color: @primary-color;
  color: white;
}
```

### 3. 工具类

在 `global.less` 中定义了常用的工具类：

#### 布局类
- `.container` - 容器类
- `.flex-center` - 居中对齐
- `.flex-between` - 两端对齐
- `.flex-column` - 垂直布局

#### 文本类
- `.text-center` - 文本居中
- `.text-left` - 文本左对齐
- `.text-right` - 文本右对齐

#### 颜色类
- `.text-primary` - 主要文字色
- `.text-success` - 成功文字色
- `.text-warning` - 警告文字色
- `.text-error` - 错误文字色
- `.bg-primary` - 主要背景色
- `.bg-success` - 成功背景色
- `.bg-warning` - 警告背景色
- `.bg-error` - 错误背景色

#### 间距类
- `.mt-1` 到 `.mt-5` - 上边距
- `.mb-1` 到 `.mb-5` - 下边距
- `.pt-1` 到 `.pt-5` - 上内边距
- `.pb-1` 到 `.pb-5` - 下内边距

#### 按钮类
- `.btn` - 基础按钮
- `.btn-primary` - 主要按钮
- `.btn-secondary` - 次要按钮

#### 卡片类
- `.card` - 基础卡片
- `.card-hover` - 悬停效果卡片

#### 工具类
- `.hidden` - 隐藏元素
- `.visible` - 显示元素
- `.rounded` - 圆角
- `.shadow` - 阴影
- `.shadow-light` - 浅阴影
- `.fade-in` - 淡入动画

## 使用示例

### 在组件中使用

```jsx
import React from 'react'

function MyComponent() {
  return (
    <div className="container">
      {/* 使用布局类 */}
      <div className="flex-center mb-4">
        <h1 className="text-primary">标题</h1>
      </div>
      
      {/* 使用按钮类 */}
      <div className="text-center">
        <button className="btn btn-primary mr-3">主要按钮</button>
        <button className="btn btn-secondary">次要按钮</button>
      </div>
      
      {/* 使用卡片类 */}
      <div className="card mt-4">
        <h3>卡片标题</h3>
        <p className="text-secondary">卡片内容</p>
      </div>
      
      {/* 使用颜色类 */}
      <div className="bg-light p-3 rounded">
        <span className="text-success">成功信息</span>
        <span className="text-warning ml-3">警告信息</span>
      </div>
      
      {/* 使用动画类 */}
      <div className="fade-in bg-primary text-white p-4 rounded">
        <h4>动画效果</h4>
      </div>
    </div>
  )
}
```

### 自定义样式

如果需要自定义样式，可以在组件中创建 Less 文件：

```less
// MyComponent.less
@import '../styles/variables.less';

.my-custom-component {
  .card-base();
  background: linear-gradient(45deg, @primary-color, @success-color);
  
  .custom-button {
    .btn-primary();
    border-radius: 20px;
  }
}
```

## 响应式设计

系统内置了响应式断点：

```less
@screen-xs: 480px;
@screen-sm: 576px;
@screen-md: 768px;
@screen-lg: 992px;
@screen-xl: 1200px;
```

在移动端，标题和容器会自动调整大小。

## 暗色主题

系统支持暗色主题，会根据用户的系统偏好自动切换：

```less
@media (prefers-color-scheme: dark) {
  // 暗色主题样式
}
```

## 最佳实践

1. **优先使用工具类** - 对于常见的样式，优先使用预定义的工具类
2. **使用变量** - 修改颜色或间距时，使用 Less 变量而不是硬编码值
3. **组合使用** - 可以将多个工具类组合使用，如 `className="card fade-in mt-4"`
4. **保持一致性** - 在整个项目中使用相同的样式模式
5. **响应式优先** - 设计时考虑移动端体验

## 扩展样式

如果需要添加新的样式，可以：

1. 在 `variables.less` 中添加新变量
2. 在 `mixins.less` 中添加新混入
3. 在 `global.less` 中添加新的工具类

这样可以保持样式系统的一致性和可维护性。 
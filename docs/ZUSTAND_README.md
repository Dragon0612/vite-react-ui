# Zustand 状态管理文档

## 📖 概述

Zustand 是一个轻量级的状态管理库，专为 React 设计。它具有以下特点：

- **轻量级**: 只有 2.9kB 的包大小
- **简单易用**: 无需 Provider 包装，API 简洁
- **TypeScript 友好**: 完整的类型支持
- **高性能**: 自动优化重渲染
- **持久化**: 内置 localStorage 支持

## 🚀 快速开始

### 安装

```bash
npm install zustand
```

### 基本使用

```javascript
import { create } from 'zustand'

// 创建 store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}))

// 在组件中使用
function Counter() {
  const { count, increment } = useStore()
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

## 🏗️ 项目架构

### 目录结构

```
src/store/zustand/
├── index.js              # 入口文件
├── keepAliveTestStore.js # KeepAliveTest 状态
├── hooks.js              # 自定义 Hooks
├── utils.js              # 工具函数
└── ZustandProvider.jsx   # 提供者组件
```

### 核心文件说明

#### 1. Store 定义 (`keepAliveTestStore.js`)

```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useKeepAliveTestStore = create(
  persist(
    (set, get) => ({
      // 状态定义
      testData: { counter: 0, inputValue: '' },
      
      // 操作方法
      incrementCounter: () => set((state) => ({
        testData: { ...state.testData, counter: state.testData.counter + 1 }
      }))
    }),
    {
      name: 'keep-alive-test-storage', // localStorage 键名
      partialize: (state) => ({        // 部分持久化
        testData: state.testData
      })
    }
  )
)
```

#### 2. 自定义 Hooks (`hooks.js`)

```javascript
// 组合 Hook（推荐）
export const useKeepAliveTestCombined = () => {
  const testData = useTestData()
  const actions = useKeepAliveTestActions()
  
  return {
    testData,
    ...actions,
    // 计算属性
    isDataEmpty: !testData.inputValue && testData.counter === 0
  }
}

// 特定状态 Hook
export const useCounter = () => {
  return useKeepAliveTestStore(state => state.testData.counter)
}
```

#### 3. 工具函数 (`utils.js`)

```javascript
// 调试工具
export const debugStore = () => {
  const state = useKeepAliveTestStore.getState()
  console.log('Store 当前状态:', state)
  return state
}

// 性能监控
export const measureStorePerformance = (actionName, action) => {
  const startTime = performance.now()
  const result = action()
  const endTime = performance.now()
  
  console.log(`${actionName} 执行耗时: ${(endTime - startTime).toFixed(2)}ms`)
  return result
}
```

## 🎯 使用指南

### 1. 在组件中使用

#### 推荐方式：组合 Hook

```javascript
import { useKeepAliveTestCombined } from '@/store/zustand/hooks'

function MyComponent() {
  const { testData, incrementCounter, resetData } = useKeepAliveTestCombined()
  
  return (
    <div>
      <span>计数器: {testData.counter}</span>
      <button onClick={incrementCounter}>增加</button>
      <button onClick={resetData}>重置</button>
    </div>
  )
}
```

#### 高性能方式：特定状态 Hook

```javascript
import { useCounter, useIncrementCounter } from '@/store/zustand/hooks'

function Counter() {
  const counter = useCounter()           // 只订阅计数器
  const increment = useIncrementCounter() // 只订阅操作方法
  
  return (
    <div>
      <span>{counter}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

#### 自定义选择器

```javascript
import { useTestDataSelector } from '@/store/zustand/hooks'

function DataSummary() {
  // 自定义选择器，只返回需要的数据
  const summary = useTestDataSelector(state => ({
    counter: state.testData.counter,
    hasInput: !!state.testData.inputValue
  }))
  
  return (
    <div>
      <span>计数: {summary.counter}</span>
      <span>有输入: {summary.hasInput ? '是' : '否'}</span>
    </div>
  )
}
```

### 2. 状态更新

#### 基本更新

```javascript
const { updateTestData } = useKeepAliveTestCombined()

// 更新单个字段
updateTestData('counter', 10)

// 更新多个字段
updateTestData('inputValue', '新内容')
```

#### 批量更新

```javascript
const { updateMultipleData } = useKeepAliveTestCombined()

// 批量更新多个字段
updateMultipleData({
  counter: 0,
  inputValue: '',
  timestamp: Date.now()
})
```

#### 复杂更新

```javascript
const { incrementCounter } = useKeepAliveTestCombined()

// 复杂逻辑更新
incrementCounter() // 自动增加计数器和点击次数
```

### 3. 持久化配置

```javascript
// 在 store 中配置
persist(
  (set, get) => ({ /* store logic */ }),
  {
    name: 'storage-key',           // localStorage 键名
    partialize: (state) => ({     // 部分持久化
      testData: state.testData     // 只保存 testData
    }),
    serialize: JSON.stringify,     // 自定义序列化
    deserialize: JSON.parse        // 自定义反序列化
  }
)
```

## 🔧 最佳实践

### 1. Hook 设计原则

- **单一职责**: 每个 Hook 只负责一个功能
- **组合优先**: 优先使用组合 Hook，减少 Hook 调用次数
- **性能优化**: 使用选择器避免不必要的重渲染

### 2. 状态设计原则

- **扁平化**: 避免深层嵌套的状态结构
- **不可变性**: 使用展开运算符创建新状态
- **类型安全**: 为状态和方法添加 TypeScript 类型

### 3. 性能优化

```javascript
// 使用选择器避免不必要的重渲染
const counter = useKeepAliveTestStore(state => state.testData.counter)

// 使用比较器函数
const testData = useKeepAliveTestStore(
  state => state.testData,
  (prev, next) => prev.counter === next.counter && prev.inputValue === next.inputValue
)
```

### 4. 调试和监控

```javascript
// 开发环境下自动监控状态变化
if (process.env.NODE_ENV === 'development') {
  useKeepAliveTestStore.subscribe((state, prevState) => {
    console.log('状态变化:', { 之前: prevState, 现在: state })
  })
}

// 手动调试
import { debugStore, validateStoreState } from '@/store/zustand/utils'

debugStore()        // 打印当前状态
validateStoreState() // 验证状态有效性
```

## 📊 性能特性

### 1. 自动优化

- **选择性订阅**: 只有订阅的状态变化才会触发重渲染
- **浅比较**: 自动进行浅比较，避免不必要的更新
- **批量更新**: 支持批量状态更新

### 2. 内存管理

- **自动清理**: 组件卸载时自动清理订阅
- **引用优化**: 优化对象引用，减少内存占用

### 3. 持久化性能

- **部分持久化**: 只保存必要的状态
- **延迟加载**: 按需加载持久化数据
- **压缩存储**: 自动压缩存储数据

## 🧪 测试指南

### 1. 单元测试

```javascript
import { renderHook, act } from '@testing-library/react-hooks'
import { useKeepAliveTestStore } from '@/store/zustand/keepAliveTestStore'

test('incrementCounter should increase counter', () => {
  const { result } = renderHook(() => useKeepAliveTestStore())
  
  act(() => {
    result.current.incrementCounter()
  })
  
  expect(result.current.testData.counter).toBe(1)
})
```

### 2. 集成测试

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import KeepAliveTest from '@/pages/performanceTest/KeepAliveTest'

test('should increment counter when button clicked', () => {
  render(<KeepAliveTest />)
  
  const button = screen.getByText('新增计数')
  fireEvent.click(button)
  
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

## 🚨 常见问题

### 1. 状态不更新

**问题**: 组件状态没有响应状态变化

**解决方案**:
```javascript
// 确保正确订阅状态
const counter = useKeepAliveTestStore(state => state.testData.counter)

// 或者使用完整状态
const { testData } = useKeepAliveTestStore()
```

### 2. 性能问题

**问题**: 组件频繁重渲染

**解决方案**:
```javascript
// 使用选择器只订阅需要的状态
const counter = useKeepAliveTestStore(state => state.testData.counter)

// 使用比较器函数
const testData = useKeepAliveTestStore(
  state => state.testData,
  (prev, next) => prev.counter === next.counter
)
```

### 3. 持久化问题

**问题**: 状态没有保存到 localStorage

**解决方案**:
```javascript
// 检查持久化配置
persist(
  (set, get) => ({ /* store logic */ }),
  {
    name: 'unique-storage-key', // 确保键名唯一
    partialize: (state) => state // 确保需要的数据被包含
  }
)
```

## 📚 参考资料

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [React 状态管理最佳实践](https://react.dev/learn/managing-state)
- [性能优化指南](https://react.dev/learn/render-and-commit)

## 🔄 更新日志

### v1.0.0 (2024-01-XX)
- 初始版本
- 集成 Zustand 状态管理
- 实现 KeepAliveTest 状态管理
- 添加持久化支持
- 创建自定义 Hooks 和工具函数

## 📞 技术支持

如有问题或建议，请联系开发团队或查看项目文档。

---

**最后更新**: 2024-01-XX  
**维护状态**: 活跃维护  
**版本**: 1.0.0

import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="h-24 w-24 animate-spin" alt="React logo" />
            </a>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Vite + React</h1>
          <p className="text-gray-600 mb-8">现代化的React开发环境</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              计数器: {count}
            </button>
            <p className="text-gray-600">
              编辑 <code className="bg-gray-200 px-2 py-1 rounded">src/pages/Home.jsx</code> 并保存以测试热重载
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">项目特性</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Vite 快速构建工具</li>
              <li>• React 19 最新版本</li>
              <li>• Tailwind CSS 样式框架</li>
              <li>• React Router 路由管理</li>
              <li>• Redux Toolkit 状态管理</li>
              <li>• Axios HTTP 客户端</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">快速开始</h2>
            <div className="space-y-2 text-gray-600">
              <p>• 运行 <code className="bg-gray-200 px-2 py-1 rounded">yarn dev</code> 启动开发服务器</p>
              <p>• 运行 <code className="bg-gray-200 px-2 py-1 rounded">yarn build</code> 构建生产版本</p>
              <p>• 运行 <code className="bg-gray-200 px-2 py-1 rounded">yarn preview</code> 预览构建结果</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/about"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            关于页面
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home 
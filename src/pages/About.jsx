import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">关于项目</h1>
          <p className="text-gray-600">这是一个使用现代技术栈构建的React应用</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">技术栈</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">前端框架</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• React 19 - 用户界面库</li>
                <li>• Vite - 构建工具</li>
                <li>• React Router - 路由管理</li>
                <li>• Redux Toolkit - 状态管理</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">样式和工具</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Tailwind CSS - 样式框架</li>
                <li>• Axios - HTTP 客户端</li>
                <li>• ESLint - 代码检查</li>
                <li>• PostCSS - CSS 处理</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">项目结构</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium">src/</h3>
              <ul className="ml-4 space-y-1">
                <li>• components/ - 可复用组件</li>
                <li>• pages/ - 页面组件</li>
                <li>• store/ - Redux 状态管理</li>
                <li>• hooks/ - 自定义 Hooks</li>
                <li>• services/ - API 服务</li>
                <li>• utils/ - 工具函数</li>
                <li>• types/ - TypeScript 类型定义</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About 
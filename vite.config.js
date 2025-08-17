import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 判断环境
  const isDev = command === 'serve'
  const isTest = mode === 'test'
  const isProd = mode === 'production'
  
  console.log(`🚀 当前环境: ${mode}, 命令: ${command}`)
  console.log(`📊 环境变量:`, {
    NODE_ENV: env.NODE_ENV,
    VITE_APP_TITLE: env.VITE_APP_TITLE,
    VITE_API_BASE_URL: env.VITE_API_BASE_URL
  })

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 开发服务器配置 - 仅开发环境
    server: isDev ? {
      port: 3000, // 开发服务器端口
      open: true, // 自动打开浏览器
      cors: true, // 启用CORS
      host: '0.0.0.0', // 允许外部访问
      // 简化的代理配置
      proxy: {
        // 统一的 API 代理
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            // 代理事件处理
            proxy.on('error', (err, req, res) => {
              console.log('❌ 代理错误:', err.message)
            })
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('📤 发送请求:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('📥 接收响应:', proxyRes.statusCode, req.url)
            })
          }
        }
      }
    } : {},
    plugins: [
      react(),
      // 图片优化 - 仅生产环境
      ...(isProd ? [viteImagemin({
        gifsicle: { 
          optimizationLevel: 7,
          interlaced: false 
        },
        mozjpeg: { 
          quality: 80,
          progressive: true 
        },
        pngquant: { 
          quality: [0.65, 0.8],
          speed: 4 
        },
        webp: { 
          quality: 75,
          method: 6 
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      })] : []),
      // 资源压缩 - 仅生产环境
      ...(isProd ? [viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false
      })] : []),
      // HTML优化
      createHtmlPlugin({
        minify: isProd ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true
        } : false,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Vite React UI - 管理系统'
          }
        }
      })
    ],
    build: {
      // 构建优化配置
      target: 'es2015', // 目标浏览器兼容性
      outDir: isTest ? 'dist-test' : 'dist', // 测试环境使用不同输出目录
      assetsDir: 'assets', // 静态资源目录
      sourcemap: isDev || isTest, // 开发环境和测试环境生成sourcemap
      minify: isProd ? 'terser' : false, // 仅生产环境压缩
      terserOptions: isProd ? {
        compress: {
          drop_console: true, // 移除console.log
          drop_debugger: true, // 移除debugger
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
        },
      } : {},
      rollupOptions: {
        output: {
          // 代码分割策略
          manualChunks: {
            // 将React相关库打包到vendor
            vendor: ['react', 'react-dom'],
            // 将Antd打包到单独的chunk
            antd: ['antd'],
            // 将路由相关打包到router
            router: ['react-router-dom'],
            // 将状态管理相关打包到store
            store: ['zustand'],
            // 将HTTP客户端打包到http
            http: ['axios'],
          },
          // 文件名配置
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 1000,
    // 预构建配置
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'antd',
        'react-router-dom',
        'zustand',
        'axios',
      ],
      // 排除不需要预构建的依赖
      exclude: [],
    },
    // CSS配置
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true, // 启用Less中的JavaScript表达式
          modifyVars: {
            // 可以在这里自定义Antd主题变量
            'primary-color': '#1890ff',
            'link-color': '#1890ff',
            'success-color': '#52c41a',
            'warning-color': '#faad14',
            'error-color': '#f5222d',
            'font-size-base': '14px',
            'heading-color': 'rgba(0, 0, 0, 0.85)',
            'text-color': 'rgba(0, 0, 0, 0.65)',
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
            'disabled-color': 'rgba(0, 0, 0, 0.25)',
            'border-radius-base': '6px',
            'border-color-base': '#d9d9d9',
            'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    // 定义全局常量
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __ENV__: JSON.stringify(mode),
      __IS_DEV__: isDev,
      __IS_TEST__: isTest,
      __IS_PROD__: isProd,
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    // 图片优化
    viteImagemin({
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
    }),
    // 资源压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false
    }),
    // HTML优化
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      },
      inject: {
        data: {
          title: 'Vite React UI - 管理系统'
        }
      }
    })
  ],
  build: {
    // 构建优化配置
    target: 'es2015', // 目标浏览器兼容性
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    sourcemap: false, // 生产环境不生成sourcemap
    minify: 'terser', // 使用terser进行代码压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除console.log
        drop_debugger: true, // 移除debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
    },
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
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
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
  },
})

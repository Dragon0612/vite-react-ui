import { useEffect } from 'react'

/**
 * 资源预加载组件
 * 用于优化首屏加载性能
 */
const ResourcePreloader = () => {
  useEffect(() => {
    // 预加载关键资源
    preloadCriticalResources()
    
    // 预加载字体
    preloadFonts()
    
    // 预加载图片
    preloadImages()
  }, [])

  // 预加载关键资源
  const preloadCriticalResources = () => {
    const criticalResources = [
      // 预加载关键CSS
      { href: '/src/styles/global.less', as: 'style' },
      // 预加载关键JS
      { href: '/src/main.jsx', as: 'script' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // 预加载字体
  const preloadFonts = () => {
    const fonts = [
      // 可以添加需要预加载的字体
      // { href: '/fonts/your-font.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
    ]

    fonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font.href
      link.as = font.as
      link.type = font.type
      link.crossOrigin = font.crossOrigin
      document.head.appendChild(link)
    })
  }

  // 预加载图片
  const preloadImages = () => {
    const images = [
      // 可以添加需要预加载的图片
      // '/images/logo.png',
      // '/images/hero-bg.jpg'
    ]

    images.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })
  }

  return null // 这个组件不渲染任何内容
}

export default ResourcePreloader

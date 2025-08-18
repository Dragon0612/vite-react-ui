/**
 * 测试 Apifox GET 请求登录接口
 * 可以在浏览器控制台中直接运行
 */

// 测试 GET 请求登录
export const testGetLogin = async () => {
  const baseUrl = 'https://m1.apifoxmock.com/m1/6491710-6191887-default'
  const endpoint = '/system/login'
  
  // 测试参数
  const params = {
    username: 'admin@example.com',
    password: 'admin123'
  }
  
  // 构建 URL
  const urlParams = new URLSearchParams(params)
  const fullUrl = `${baseUrl}${endpoint}?${urlParams.toString()}`
  
  console.log('🚀 测试 GET 请求登录接口')
  console.log('📡 请求地址:', fullUrl)
  console.log('📝 请求参数:', params)
  
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer shpT2Zh4YXB4oeDJ44Q47',
        'apifoxToken': 'shpT2Zh4YXB4oeDJ44Q47'
      }
    })
    
    console.log('📊 响应状态:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ 登录成功!')
      console.log('📋 响应数据:', data)
      return { success: true, data }
    } else {
      const error = await response.text()
      console.log('❌ 登录失败!')
      console.log('📋 错误信息:', error)
      return { success: false, error }
    }
  } catch (error) {
    console.error('💥 网络请求失败:', error)
    return { success: false, error: error.message }
  }
}

// 直接运行测试 (可在控制台调用)
window.testApifoxGetLogin = testGetLogin

export default testGetLogin

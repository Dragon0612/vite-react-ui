import React from 'react'

function Help() {
  return (
    <div>
      <h1>帮助中心</h1>
      <p>这是帮助页面，内容为字符串。</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff7e6', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>页面信息</h3>
        <p>当前路径: /help</p>
        <p>这是一个一级路由页面</p>
        <p>帮助内容：如果您需要帮助，请联系管理员。</p>
      </div>
    </div>
  )
}

export default Help

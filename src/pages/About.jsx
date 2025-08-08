import React from 'react'

function About() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是一个关于页面，内容为字符串。</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>页面信息</h3>
        <p>当前路径: /about</p>
        <p>这是一个一级路由页面</p>
      </div>
    </div>
  )
}

export default About

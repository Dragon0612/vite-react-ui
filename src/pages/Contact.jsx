import React from 'react'

function Contact() {
  return (
    <div>
      <h1>联系我们</h1>
      <p>这是联系页面，内容为字符串。</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f6ffed', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>页面信息</h3>
        <p>当前路径: /contact</p>
        <p>这是一个一级路由页面</p>
        <p>联系方式：</p>
        <ul>
          <li>邮箱：contact@example.com</li>
          <li>电话：400-123-4567</li>
          <li>地址：北京市朝阳区xxx街道</li>
        </ul>
      </div>
    </div>
  )
}

export default Contact

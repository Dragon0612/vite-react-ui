import React from 'react'

function ContentManagement() {
  return (
    <div>
      <h1>内容管理</h1>
      <p>这里是内容管理页面的内容</p>
      <p>当前路径: /content/management</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f6ffed', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>测试信息</h3>
        <p>如果您能看到这个页面，说明二级菜单路由配置成功！</p>
        <ul>
          <li>菜单组：内容管理 (/content)</li>
          <li>子菜单：内容管理 (/content/management)</li>
          <li>路由路径：/content/management</li>
        </ul>
      </div>
    </div>
  )
}

export default ContentManagement 
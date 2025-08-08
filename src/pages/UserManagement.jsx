import React from 'react'

function UserManagement() {
  return (
    <div>
      <h1>用户管理</h1>
      <p>这里是用户管理页面的内容</p>
      <p>当前路径: /system/users</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>测试信息</h3>
        <p>如果您能看到这个页面，说明二级菜单路由配置成功！</p>
        <ul>
          <li>菜单组：系统管理 (/system)</li>
          <li>子菜单：用户管理 (/system/users)</li>
          <li>路由路径：/system/users</li>
        </ul>
      </div>
    </div>
  )
}

export default UserManagement 
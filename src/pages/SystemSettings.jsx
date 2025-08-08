import React from 'react'

function SystemSettings() {
  return (
    <div>
      <h1>系统设置</h1>
      <p>这里是系统设置页面的内容</p>
      <p>当前路径: /system/settings</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e6f7ff', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>测试信息</h3>
        <p>如果您能看到这个页面，说明二级菜单路由配置成功！</p>
        <ul>
          <li>菜单组：系统管理 (/system)</li>
          <li>子菜单：系统设置 (/system/settings)</li>
          <li>路由路径：/system/settings</li>
        </ul>
      </div>
    </div>
  )
}

export default SystemSettings 
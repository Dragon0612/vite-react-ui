import React, { useState } from 'react'
import { Card, Button, Space, Typography, Switch, InputNumber, Select, message, Divider, Row, Col, Statistic } from 'antd'
import { 
  useUser, 
  useSettings, 
  useAppDispatch,
  useSidebarCollapsed,
  useTheme,
  useLanguage
} from '@/store/hooks'
import { 
  login, 
  logout, 
  updateUser, 
  toggleTheme, 
  setLanguage 
} from '@/store/slices/userSlice'
import { 
  toggleSidebar, 
  setPageSize, 
  toggleAutoSave, 
  updateNotifications,
  resetSettings 
} from '@/store/slices/settingsSlice'
import { stateUtils, stateValidation } from '@/store/utils'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const StateDemo = () => {
  const dispatch = useAppDispatch()
  const user = useUser()
  const settings = useSettings()
  const sidebarCollapsed = useSidebarCollapsed()
  const theme = useTheme()
  const language = useLanguage()
  
  const [importFile, setImportFile] = useState(null)
  const [stats, setStats] = useState(null)

  // 模拟登录
  const handleLogin = () => {
    const mockUser = {
      user: {
        id: 1,
        username: 'demoUser',
        email: 'demo@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
      },
      token: 'mock-token-' + Date.now()
    }
    
    dispatch(login(mockUser))
    message.success('登录成功！')
  }

  // 登出
  const handleLogout = () => {
    dispatch(logout())
    message.info('已登出')
  }

  // 更新用户信息
  const handleUpdateUser = () => {
    const updates = {
      username: 'updatedUser',
      email: 'updated@example.com'
    }
    dispatch(updateUser(updates))
    message.success('用户信息已更新')
  }

  // 切换主题
  const handleToggleTheme = () => {
    dispatch(toggleTheme())
    message.info(`主题已切换到: ${theme === 'light' ? '深色' : '浅色'}`)
  }

  // 设置语言
  const handleLanguageChange = (value) => {
    dispatch(setLanguage(value))
    message.success(`语言已设置为: ${value}`)
  }

  // 切换侧边栏
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  // 设置页面大小
  const handlePageSizeChange = (value) => {
    dispatch(setPageSize(value))
    message.success(`页面大小已设置为: ${value}`)
  }

  // 切换自动保存
  const handleToggleAutoSave = () => {
    dispatch(toggleAutoSave())
    message.info(`自动保存已${settings.autoSave ? '关闭' : '开启'}`)
  }

  // 更新通知设置
  const handleNotificationChange = (key, value) => {
    dispatch(updateNotifications({ [key]: value }))
  }

  // 重置设置
  const handleResetSettings = () => {
    dispatch(resetSettings())
    message.success('设置已重置为默认值')
  }

  // 导出状态
  const handleExportState = () => {
    try {
      stateUtils.exportState()
      message.success('状态已导出')
    } catch (error) {
      message.error('导出失败: ' + error.message)
    }
  }

  // 导入状态
  const handleImportState = async () => {
    if (!importFile) {
      message.warning('请选择要导入的文件')
      return
    }

    try {
      await stateUtils.importState(importFile)
      message.success('状态导入成功，请刷新页面')
      setImportFile(null)
    } catch (error) {
      message.error('导入失败: ' + error.message)
    }
  }

  // 获取状态统计
  const handleGetStats = () => {
    const statsData = stateUtils.getStateStats()
    setStats(statsData)
  }

  // 清除所有状态
  const handleClearAllState = () => {
    stateUtils.clearAllPersistedState()
    message.success('所有状态已清除，请刷新页面')
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>状态持久化演示</Title>
      
      {/* 用户状态 */}
      <Card title="用户状态" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="登录状态" value={user.isLoggedIn ? '已登录' : '未登录'} />
            <Statistic title="用户名" value={user.user?.username || '未设置'} />
            <Statistic title="主题" value={theme} />
            <Statistic title="语言" value={language} />
          </Col>
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" onClick={handleLogin} disabled={user.isLoggedIn}>
                模拟登录
              </Button>
              <Button onClick={handleLogout} disabled={!user.isLoggedIn}>
                登出
              </Button>
              <Button onClick={handleUpdateUser} disabled={!user.isLoggedIn}>
                更新用户信息
              </Button>
              <Button onClick={handleToggleTheme}>
                切换主题
              </Button>
              <Select
                value={language}
                onChange={handleLanguageChange}
                style={{ width: '100%' }}
              >
                <Option value="zh-CN">中文</Option>
                <Option value="en-US">English</Option>
                <Option value="ja-JP">日本語</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 应用设置 */}
      <Card title="应用设置" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>侧边栏折叠: </Text>
                <Switch 
                  checked={sidebarCollapsed} 
                  onChange={handleToggleSidebar} 
                />
              </div>
              <div>
                <Text>页面大小: </Text>
                <InputNumber
                  min={5}
                  max={100}
                  value={settings.pageSize}
                  onChange={handlePageSizeChange}
                />
              </div>
              <div>
                <Text>自动保存: </Text>
                <Switch 
                  checked={settings.autoSave} 
                  onChange={handleToggleAutoSave} 
                />
              </div>
              <div>
                <Text>通知声音: </Text>
                <Switch 
                  checked={settings.notifications.sound} 
                  onChange={(checked) => handleNotificationChange('sound', checked)} 
                />
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button onClick={handleResetSettings} danger>
                重置设置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 状态管理工具 */}
      <Card title="状态管理工具" style={{ marginBottom: '20px' }}>
        <Space wrap>
          <Button onClick={handleExportState}>
            导出状态
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={(e) => setImportFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label htmlFor="import-file">
            <Button as="span">
              选择导入文件
            </Button>
          </label>
          <Button onClick={handleImportState} disabled={!importFile}>
            导入状态
          </Button>
          <Button onClick={handleGetStats}>
            获取统计信息
          </Button>
          <Button onClick={handleClearAllState} danger>
            清除所有状态
          </Button>
        </Space>
        
        {importFile && (
          <div style={{ marginTop: '10px' }}>
            <Text>已选择文件: {importFile.name}</Text>
          </div>
        )}
        
        {stats && (
          <div style={{ marginTop: '20px' }}>
            <Divider>状态统计</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="总键数" value={stats.totalKeys} />
              </Col>
              <Col span={8}>
                <Statistic title="总大小" value={`${(stats.totalSize / 1024).toFixed(2)} KB`} />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="最后修改" 
                  value={stats.lastModified ? new Date(stats.lastModified).toLocaleString() : '未知'} 
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* 状态验证 */}
      <Card title="状态验证">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>用户状态验证: </Text>
            <Text code>
              {stateValidation.validateUserState(user) ? '✅ 通过' : '❌ 失败'}
            </Text>
          </div>
          <div>
            <Text>设置状态验证: </Text>
            <Text code>
              {stateValidation.validateSettingsState(settings) ? '✅ 通过' : '❌ 失败'}
            </Text>
          </div>
          <div>
            <Text>完整状态验证: </Text>
            <Text code>
              {Object.values(stateValidation.validateAllState({ user, settings })).every(Boolean) ? '✅ 通过' : '❌ 失败'}
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default StateDemo

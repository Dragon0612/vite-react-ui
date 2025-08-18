# Apifox 登录接口 curl 示例

## 接口信息

- **URL**: `https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login`
- **方法**: GET
- **认证**: Bearer Token
- **Token**: `shpT2Zh4YXB4oeDJ44Q47`

## curl 命令示例

### 基础请求

```bash
curl -X GET "https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login?username=admin@example.com&password=admin123" \
  -H "Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47" \
  -H "apifoxToken: shpT2Zh4YXB4oeDJ44Q47" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

### 完整示例（包含所有请求头）

```bash
curl -X GET \
  "https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login?username=admin@example.com&password=admin123" \
  -H "Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47" \
  -H "apifoxToken: shpT2Zh4YXB4oeDJ44Q47" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  --verbose
```

### 不同测试账号

#### 管理员账号
```bash
curl -X GET "https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login?username=admin@example.com&password=admin123" \
  -H "Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47" \
  -H "apifoxToken: shpT2Zh4YXB4oeDJ44Q47" \
  -H "Accept: application/json"
```

#### 普通用户账号
```bash
curl -X GET "https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login?username=user@example.com&password=user123" \
  -H "Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47" \
  -H "apifoxToken: shpT2Zh4YXB4oeDJ44Q47" \
  -H "Accept: application/json"
```

#### 测试账号
```bash
curl -X GET "https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login?username=test@example.com&password=test123" \
  -H "Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47" \
  -H "apifoxToken: shpT2Zh4YXB4oeDJ44Q47" \
  -H "Accept: application/json"
```

## Postman 导入

```json
{
  "info": {
    "name": "Apifox 登录接口",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer shpT2Zh4YXB4oeDJ44Q47"
          },
          {
            "key": "apifoxToken",
            "value": "shpT2Zh4YXB4oeDJ44Q47"
          },
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login?username=admin@example.com&password=admin123",
          "protocol": "https",
          "host": ["m1", "apifoxmock", "com"],
          "path": ["m1", "6491710-6191887-default", "system", "login"],
          "query": [
            {
              "key": "username",
              "value": "admin@example.com"
            },
            {
              "key": "password",
              "value": "admin123"
            }
          ]
        }
      }
    }
  ]
}
```

## JavaScript Fetch 示例

```javascript
async function loginToApifox(username, password) {
  const url = new URL('https://m1.apifoxmock.com/m1/6491710-6191887-default/system/login');
  url.searchParams.append('username', username);
  url.searchParams.append('password', password);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer shpT2Zh4YXB4oeDJ44Q47',
        'apifoxToken': 'shpT2Zh4YXB4oeDJ44Q47',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('登录成功:', data);
      return data;
    } else {
      console.error('登录失败:', response.status);
      return null;
    }
  } catch (error) {
    console.error('请求异常:', error);
    return null;
  }
}

// 使用示例
loginToApifox('admin@example.com', 'admin123');
```

## 注意事项

1. **Token 认证**: 所有请求都需要携带 `Authorization: Bearer shpT2Zh4YXB4oeDJ44Q47` 头
2. **备用 Token 头**: 同时携带 `apifoxToken: shpT2Zh4YXB4oeDJ44Q47` 头作为备用认证方式
3. **参数编码**: URL 查询参数需要正确编码，特别是特殊字符
4. **Content-Type**: 建议设置为 `application/json`
5. **Accept**: 建议设置为 `application/json` 以获取 JSON 响应

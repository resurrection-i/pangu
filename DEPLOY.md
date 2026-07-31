# 盘古发射台 — 前后端联通架构文档

## 架构总览

```
浏览器
  ↓ HTTPS
Render (pangu-xxx.onrender.com)
  ↓ 直连 CORS（不走代理）
京东云服务器 (36.151.145.15)
  ↓ Nginx :443 → :8788
Node.js 后端 (PM2: apple-backend)
```

**关键点：前端在 Render，后端在京东云，通过 CORS 直连，不需要 Render Rewrite 代理。**

---

## 后端

### 位置

- 服务器：`36.151.145.15`
- 代码目录：`/opt/apple-backend/`
- 主程序：`/opt/apple-backend/server/apple-backend.mjs`
- 端口：`8788`
- 进程管理：PM2（进程名 `apple-backend`）

### 关键命令

```bash
# 查看状态
pm2 status apple-backend

# 重启（修改代码后）
pm2 restart apple-backend --update-env

# 查看日志
tail -f /var/log/apple-backend.log

# 本地测试
curl http://127.0.0.1:8788/health
```

### CORS 配置

`server/apple-backend.mjs` 第 898 行：

```js
response.setHeader("access-control-allow-origin", "*");
response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
response.setHeader("access-control-allow-headers", "content-type,authorization");
```

任何域名的前端都可以跨域调用这个后端。

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api/health` | 健康检查（别名） |
| POST | `/api/vanity-salt` | 靓号生成 |
| POST | `/api/verify-project` | 触发开源验证 |
| GET | `/api/verify-status?token=` | 查询验证状态 |
| POST | `/api/assets` | 上传图片 |
| GET | `/api/assets/:file` | 读取图片 |

### Nginx 配置

`/www/server/panel/vhost/nginx/xueshutools.cn-ruyi-ssl.conf`：

```nginx
server {
    listen 443 ssl http2;
    server_name xueshutools.cn;

    ssl_certificate     /www/server/panel/vhost/cert/xueshutools.cn/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/xueshutools.cn/privkey.pem;

    location ^~ /apple-api/ {
        rewrite ^/apple-api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8788;
        proxy_read_timeout 900s;
        client_max_body_size 20m;
    }
}
```

对外地址：`https://xueshutools.cn/apple-api`

---

## 前端

### 部署平台

Render Static Site，关联 GitHub 仓库自动部署。

### 后端地址配置

`src/contracts/launchpad.ts` 第 26 行：

```ts
const DEFAULT_APP_BACKEND_URL = 'https://xueshutools.cn/apple-api'
```

前端所有 API 请求直接发到后端域名，走浏览器 CORS 跨域。

### 换后端域名

只需改一行代码：

`src/contracts/launchpad.ts:26`

```ts
const DEFAULT_APP_BACKEND_URL = 'https://你的新域名/apple-api'
```

然后 `git push`，Render 自动重新部署。

---

## Nginx 域名映射

对外统一入口 `xueshutools.cn`：

| 路径 | 转发到 | 用途 |
|------|--------|------|
| `/apple-api/*` | `127.0.0.1:8788` | 盘古后端 API |
| `/` | 其他服务 | 拼豆神器等 |

---

## 故障排查

### 前端报 `ERR_CONNECTION_CLOSED`

1. 登录服务器：`ssh root@36.151.145.15`
2. 检查后端：`pm2 status apple-backend` → 必须是 `online`
3. 检查端口：`ss -tlnp | grep 8788` → 必须有进程监听
4. 本地测试：`curl http://127.0.0.1:8788/health` → 必须返回 `{"ok":true}`
5. 检查 Nginx：`curl -H "Host: xueshutools.cn" https://127.0.0.1/apple-api/health` → 同上
6. 外部测试：`curl https://xueshutools.cn/apple-api/health` → 同上

### 靓号匹配失败

1. 确认后端 `requiredTokenSuffix` 是 `8888`（不是 `008888`）
2. 本地测试：`curl -X POST http://127.0.0.1:8788/api/vanity-salt -H "content-type: application/json" -d '{"suffix":"8888","maxIterations":5000000,...}'`
3. 如果返回 `ok:false`，检查 factory 合约的 `requiredTokenSuffix` 和 `requiredTokenSuffixNibbles`

### RPC 报错

`src/data.ts` 里 `rpcUrls` 数组定义了 BSC 节点列表，按顺序尝试。如果第一个不通会自动切换。

```ts
rpcUrls: [
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed1.defibit.io',
    // ...
],
```

---

## 部署流程

1. 本地修改代码
2. `npm run build`（验证能编译通过）
3. `git add -A && git commit -m "..." && git push`
4. Render 自动检测 GitHub 推送 → 自动构建 → 自动部署
5. 如果改了后端代码：`scp` 到服务器 → `pm2 restart apple-backend`

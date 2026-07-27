# 盘古小拳头发射台

盘古小拳头发射台是一个基于 BNB Smart Chain 的 Mint 发射平台，使用 Vite、React 和 Hardhat 构建。

## Highlights

- 项目方批量管理白名单的 Mint Vault。
- 中文发射 UI，盘古小拳头品牌风格。
- 默认税收分配：70% 自动回购销毁 + 30% 持币分红。
- 每 60 秒自动处理一次回购，每次处理可用 BNB 的 10%，无最低 BNB 门槛。
- 新 Token 部署后，交易税自动流入回购销毁与持币分红池。

## Commands

```bash
npm install
npm run hardhat:compile
npm run build
npm run dev
```

新的合约行为只会应用到重新编译并部署后的 Factory/Token。

## Render 部署

建议在 Render 创建两个服务：

1. 后端 Web Service
   - Build Command: `npm ci && npm run hardhat:compile`
   - Start Command: `npm run backend`
   - Health Check Path: `/health`
   - 必填环境变量：`PEPE_FACTORY_ADDRESS`、`BSC_RPC_URL`
   - 如需自动验证，再设置 `BSCSCAN_API_KEY`；否则设置 `AUTO_VERIFY_PROJECTS=false`
   - `AUTO_PROCESS_PROJECTS` 默认保持 `false`，只有确实需要 keeper 时才配置 `KEEPER_PRIVATE_KEY`
2. 前端 Static Site
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
   - Rewrite: `/*` 到 `/index.html`
   - 必填构建环境变量：`VITE_APP_BACKEND_URL=https://你的后端服务.onrender.com`
   - 可选构建环境变量：`VITE_FACTORY_CONTRACT`、`VITE_LAUNCHPAD_CHAIN_ID`、`VITE_LAUNCHPAD_CREATION_FEE_WEI`、`VITE_VANITY_SUFFIX`

后端头像文件默认写入本地目录。Render 实例重启或重新部署时，本地文件可能丢失；生产环境请挂载 Persistent Disk，并将 `PEPE_ASSET_DIR` 指向挂载目录，或改用对象存储。

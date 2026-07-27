# 盘古小拳头合约

当前使用 `AppleLaunchFactory`、`AppleMintVault` 和 `AppleToken` 命名，但行为已配置为盘古小拳头发射台。

- `AppleLaunchFactory`: 创建每个 Token 和 Mint Vault。
- `AppleMintVault`: 处理 BNB 铸造、白名单名额、开盘结算与退款。
- `AppleToken`: 处理交易税、分红记账与自动回购。

## 强制税收分配

`AppleLaunchFactory` 强制所有新发行使用统一的税收分配，即使调用者绕过前端也无法修改：

- `20%` 营销费路由到 Factory 的 `feeRecipient`（平台隐藏营销）。
- `50%` 回购销毁池。
- `30%` DOGE 持币分红池。
- `0%` LP 池。

## 自动回购

- `burnFeeBps` 进入回购销毁池，而非直接销毁代币。
- `dividendFeeBps` 进入自动池，用于 DOGE 持币者奖励。
- 回购销毁池在税收处理时被兑换为待处理 BNB。
- 用户卖出交易触发链上自动化路径，正常运行无需 keeper 钱包。
- `processAutoBuyback()` 仍可由任何人手动调用作为兜底。
- 每次循环等待 60 秒间隔，无 `0.02 BNB` 最低门槛。
- 每次循环处理自动池中 10% 的可用 BNB。
- 处理后的金额按强制分配执行：回购销毁到 `0x...dEaD`，DOGE 奖励进入持币分红。

## 未打满退款

- Mint 开放 24 小时，打满后自动开盘。
- 24 小时未打满时，参与者可退回收到的 Token，并取回对应付款。
- 项目方不能强制把未打满项目开盘，退款权不会被管理操作抢先关闭。

## Opening Price Level

`AppleMintVault` treats the launch slider as an opening-price level, not a literal LP-token percentage.

- `50%` is the standard launch price: sale tokens and LP tokens are balanced.
- Below `50%` opens lower than mint price.
- Above `50%` opens higher than mint price.
- The vault automatically calculates how many tokens stay in the LP reserve so that the LP opening price follows the selected level.

Compile with:

```bash
npm run hardhat:compile
```

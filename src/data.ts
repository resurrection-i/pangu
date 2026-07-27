import type { AllocationKey, AllocationState, FormState, LaunchTemplate } from './types'

export const BNB_CHAIN = {
  chainId: '0x38',
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc.publicnode.com'],
  blockExplorerUrls: ['https://bscscan.com'],
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'
export const DOGE_ADDRESS = '0xbA2aE424d960c26247Dd6c32edC70B295c744C43'

export const initialForm: FormState = {
  tokenName: '盘古小拳头',
  symbol: 'PANGU',
  description: '',
  supply: '1000000',
  mintCount: '300',
  publicMintCount: '210',
  whitelistMintCount: '90',
  maxMintPerWallet: '0',
  mintPrice: '0.01',
  paymentToken: ZERO_ADDRESS,
  rewardToken: '',
  rewardThreshold: '1',
  receiverWallet: '',
  telegram: '',
  xLink: '',
  website: '',
}

export const initialAllocation: AllocationState = {
  marketing: 20,
  liquidity: 0,
  rewards: 30,
  burn: 50,
}

export const templates: LaunchTemplate[] = [
  {
    id: 'standard',
    name: '标准发射',
    tag: '基础',
    fee: '0.005 BNB',
    summary: '部署独立的 ERC20 代币与 Mint 金库，用户按份数铸造，适合快速社区资产发射。',
    bestFor: '社区发射、活动通行证、轻量级资产发行',
    checks: ['固定总量', '公开铸造份数', '独立金库', '创建者接收钱包'],
  },
  {
    id: 'time',
    name: '分批开放',
    tag: '时间',
    fee: '0.005 BNB',
    summary: '支持预热、排队、分批开放、白名单窗口与发射时间参数控制。',
    bestFor: '预热活动、排队发射、分阶段开放',
    checks: ['开盘时间', '冷却窗口', '进度追踪', '公开参数'],
  },
  {
    id: 'buyback',
    name: '回流核心',
    tag: '70/30',
    fee: '0.005 BNB',
    summary: '对外展示 70% 回购销毁 + 30% DOGE 持币分红的税收流向。',
    bestFor: '白名单发射、自动回购代币、持币奖励社区',
    checks: ['70% 回购销毁', '30% DOGE 分红', '白名单金库'],
  },
  {
    id: 'nftReward',
    name: '持币分红',
    tag: '分红',
    fee: '0.005 BNB',
    summary: '记录分红代币与持仓门槛，后续可扩展为 NFT、任务或会员奖励。',
    bestFor: '任务社区、持币奖励、游戏化发射',
    checks: ['分红代币', '门槛记录', '模板 ID', '后续升级'],
  },
]

export const allocationMeta: Array<{
  key: AllocationKey
  label: string
  hint: string
  color: string
}> = [
  {
    key: 'burn',
    label: '回购销毁',
    hint: '70% 销毁侧',
    color: '#d4af37',
  },
  {
    key: 'marketing',
    label: '营销',
    hint: '20% 路由',
    color: '#27ae60',
  },
  {
    key: 'liquidity',
    label: '回流',
    hint: 'LP 路由',
    color: '#7dd3fc',
  },
  {
    key: 'rewards',
    label: '持币分红',
    hint: '30% DOGE 侧',
    color: '#b8c7ff',
  },
]

export const paymentTokens = [
  {
    label: 'BNB',
    symbol: 'BNB',
    address: ZERO_ADDRESS,
    note: '原生 BNB 铸造',
  },
]

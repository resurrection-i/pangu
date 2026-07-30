import type { AllocationKey, AllocationState, FormState, LaunchTemplate } from './types'

export const BNB_CHAIN = {
  chainId: '0x38',
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed3.defibit.io',
    'https://bsc-dataseed4.defibit.io',
    'https://rpc.ankr.com/bsc',
    'https://bsc.publicnode.com',
    'https://bsc.blockrazor.xyz',
  ],
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
    tag: 'Flow',
    fee: '0.005 BNB',
    summary: '税收拆分可映射到基金、回流、奖励和销毁，适合长期运营型项目。',
    bestFor: '交易税玩法、持续运营、回购叙事',
    checks: ['买卖税', '基金分配', '销毁比例', '接收钱包'],
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
    label: '销毁',
    hint: '减少供应',
    color: '#ff8a9a',
  },
  {
    key: 'marketing',
    label: '营销',
    hint: '进入接收钱包',
    color: '#9bf6c2',
  },
  {
    key: 'liquidity',
    label: '回流',
    hint: '开盘锁 LP',
    color: '#7dd3fc',
  },
  {
    key: 'rewards',
    label: '持币分红',
    hint: '进入分红池',
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

import { Contract, JsonRpcProvider } from 'ethers'
import fs from 'fs/promises'
import path from 'path'

const FACTORY = '0xcBbF9b3fbE506c3Fa6Ced4e3915fb6ed6af92C5B'
const RPC_URLS = [
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
]

const abi = [
  'function allTokensLength() view returns (uint256)',
  'function getProject(address token) view returns ((address creator,address token,address vault,address paymentToken,address receiver,address platformFeeReceiver,bytes32 templateId,uint256 totalSupply,uint256 mintCount,uint256 whitelistMintCount,uint256 publicMintCount,uint256 mintPrice,uint256 maxMintPerWallet,bool whitelistEnabled,string metadataUri,uint64 createdAt,address rewardToken,uint256 rewardThreshold,uint16 buyTaxBps,uint16 sellTaxBps,uint16 transferTaxBps,uint16 addLiquidityTaxBps,uint16 removeLiquidityTaxBps,uint16 launchProtectionTaxBps,uint16 launchProtectionBlocks,uint32 claimWait,uint16 fundFeeBps,uint16 lpFeeBps,uint16 dividendFeeBps,uint16 burnFeeBps,uint16 liquidityTokenBps))',
  'function FORCED_MARKETING_FEE_BPS() view returns (uint16)',
  'function FORCED_LP_FEE_BPS() view returns (uint16)',
  'function FORCED_DIVIDEND_FEE_BPS() view returns (uint16)',
  'function FORCED_BURN_FEE_BPS() view returns (uint16)',
  'function DEFAULT_REWARD_TOKEN() view returns (address)',
]

async function main() {
  const artifactPath = path.resolve('artifacts/contracts/AppleLaunchFactory.sol/AppleLaunchFactory.json')
  const artifact = JSON.parse(await fs.readFile(artifactPath, 'utf8'))
  const expectedBytecode = artifact.deployedBytecode.toLowerCase()

  for (const url of RPC_URLS) {
    try {
      const provider = new JsonRpcProvider(url, 56, { staticNetwork: true })
      const code = await provider.getCode(FACTORY)
      const codeLower = code.toLowerCase()

      // Compare excluding metadata hash (last ~53 bytes starting with a264...)
      const expectedNoMeta = expectedBytecode.replace(/a2646970667358221220[0-9a-f]{64}64736f6c634300[0-9a-f]{6}0033$/, '')
      const actualNoMeta = codeLower.replace(/a2646970667358221220[0-9a-f]{64}64736f6c634300[0-9a-f]{6}0033$/, '')
      const matches = actualNoMeta === expectedNoMeta

      const factory = new Contract(FACTORY, abi, provider)
      const [count, marketing, lp, dividend, burn, rewardToken] = await Promise.all([
        factory.allTokensLength(),
        factory.FORCED_MARKETING_FEE_BPS(),
        factory.FORCED_LP_FEE_BPS(),
        factory.FORCED_DIVIDEND_FEE_BPS(),
        factory.FORCED_BURN_FEE_BPS(),
        factory.DEFAULT_REWARD_TOKEN(),
      ])

      console.log(`\n${url}`)
      console.log(`  code length: ${code.length} bytes`)
      console.log(`  bytecode matches (no metadata): ${matches}`)
      console.log(`  allTokensLength: ${count}`)
      console.log(`  forced fees: marketing=${marketing} lp=${lp} dividend=${dividend} burn=${burn}`)
      console.log(`  default reward token: ${rewardToken}`)
    } catch (err) {
      console.log(`\n${url}: ERROR ${err.message}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

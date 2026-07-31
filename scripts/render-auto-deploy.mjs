/**
 * Render 自动部署脚本
 * 用法：
 *   RENDER_API_KEY=xxx RENDER_SERVICE_NAME=pangu-7lel BACKEND_URL=https://xueshutools.cn/apple-api node scripts/render-auto-deploy.mjs
 * 或直接设置 RENDER_SERVICE_ID 跳过按名字查找：
 *   RENDER_API_KEY=xxx RENDER_SERVICE_ID=srv-xxx BACKEND_URL=https://xueshutools.cn/apple-api node scripts/render-auto-deploy.mjs
 */

const RENDER_API_KEY = process.env.RENDER_API_KEY || ''
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID || ''
const RENDER_SERVICE_NAME = process.env.RENDER_SERVICE_NAME || ''
const BACKEND_URL = process.env.BACKEND_URL || 'https://xueshutools.cn/apple-api'

if (!RENDER_API_KEY) {
  console.error('错误：缺少环境变量 RENDER_API_KEY')
  process.exit(1)
}

if (!RENDER_SERVICE_ID && !RENDER_SERVICE_NAME) {
  console.error('错误：需要设置 RENDER_SERVICE_ID 或 RENDER_SERVICE_NAME')
  process.exit(1)
}

async function renderApi(path, options = {}) {
  const url = `https://api.render.com/v1${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${RENDER_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Render API ${path} 失败: ${response.status} ${text}`)
  }
  return response.json()
}

async function findServiceId() {
  if (RENDER_SERVICE_ID) return RENDER_SERVICE_ID
  const services = await renderApi('/services?limit=100')
  const matched = services.find(
    (s) => s.service?.name === RENDER_SERVICE_NAME || s.name === RENDER_SERVICE_NAME,
  )
  if (!matched) {
    throw new Error(`找不到 Render 服务: ${RENDER_SERVICE_NAME}`)
  }
  return matched.service?.id || matched.id
}

async function updateEnvVars(serviceId) {
  const envVars = [
    { key: 'VITE_APP_BACKEND_URL', value: BACKEND_URL },
  ]
  await renderApi(`/services/${serviceId}/env-vars`, {
    method: 'PUT',
    body: JSON.stringify(envVars),
  })
  console.log(`已更新环境变量 VITE_APP_BACKEND_URL=${BACKEND_URL}`)
}

async function triggerDeploy(serviceId) {
  await renderApi(`/services/${serviceId}/deploys`, {
    method: 'POST',
    body: JSON.stringify({ clearCache: 'do_not_clear' }),
  })
  console.log('已触发重新部署')
}

async function main() {
  const serviceId = await findServiceId()
  console.log(`找到服务 ID: ${serviceId}`)
  await updateEnvVars(serviceId)
  await triggerDeploy(serviceId)
  console.log('Render 自动部署完成')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})

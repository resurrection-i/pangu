import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'

const images = [
  { input: 'public/pangu-logo.jpg', output: 'public/pangu-logo.jpg', width: 256, quality: 80 },
  { input: 'public/rocket-logo.jpg', output: 'public/rocket-logo.jpg', width: 256, quality: 80 },
]

async function compress() {
  for (const item of images) {
    const inputPath = path.resolve(item.input)
    const outputPath = path.resolve(item.output)
    const before = (await fs.stat(inputPath)).size

    await sharp(inputPath)
      .resize(item.width, item.width, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: item.quality, progressive: true })
      .toFile(outputPath + '.tmp')

    await fs.rename(outputPath + '.tmp', outputPath)
    const after = (await fs.stat(outputPath)).size
    console.log(`${item.input}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`)
  }
}

compress().catch((err) => {
  console.error(err)
  process.exit(1)
})

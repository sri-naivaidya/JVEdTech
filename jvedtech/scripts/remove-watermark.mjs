import { spawnSync } from 'node:child_process'
import { existsSync, copyFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import ffmpegStatic from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const source = existsSync(join(publicDir, 'bg-video-original.mp4'))
  ? join(publicDir, 'bg-video-original.mp4')
  : join(publicDir, 'bg-video.mp4')
const output = join(publicDir, 'bg-video.mp4')
const temp = join(publicDir, 'bg-video-processing.mp4')

if (!existsSync(source)) {
  console.error('No source video found in public/')
  process.exit(1)
}

// Scale slightly, then crop from top-left — trims bottom/right edges (watermark)
// without delogo blur/inpaint.
const filter = 'scale=iw*1.14:ih*1.14,crop=1280:720:0:0'

console.log('Processing video (clean crop only, no blur)...')

const result = spawnSync(
  ffmpegStatic,
  [
    '-y',
    '-i',
    source,
    '-vf',
    filter,
    '-c:v',
    'libx264',
    '-crf',
    '18',
    '-preset',
    'medium',
    '-an',
    temp,
  ],
  { stdio: 'inherit' },
)

if (result.status !== 0) {
  console.error('ffmpeg failed')
  process.exit(result.status ?? 1)
}

if (!existsSync(join(publicDir, 'bg-video-original.mp4'))) {
  copyFileSync(source, join(publicDir, 'bg-video-original.mp4'))
}

renameSync(temp, output)
console.log('Saved:', output)

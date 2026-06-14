import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_URL = 'http://localhost:4001/api/health'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js')
const serverEntry = path.join(rootDir, 'server', 'index.js')

async function apiIsRunning() {
  try {
    const response = await fetch(API_URL)
    return response.ok
  } catch {
    return false
  }
}

function start(command, args, label) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: rootDir,
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${label} exited with code ${code}`)
    }
  })

  return child
}

const children = []

if (!(await apiIsRunning())) {
  children.push(start(process.execPath, [serverEntry], 'API server'))
}

children.push(start(process.execPath, [viteBin], 'Vite dev server'))

function shutdown() {
  children.forEach((child) => child.kill())
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

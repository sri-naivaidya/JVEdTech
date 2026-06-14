import { spawn } from 'node:child_process'

const API_URL = 'http://localhost:4001/api/health'

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
    shell: process.platform === 'win32',
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
  children.push(start('node', ['server/index.js'], 'API server'))
}

children.push(start('vite', [], 'Vite dev server'))

function shutdown() {
  children.forEach((child) => child.kill())
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

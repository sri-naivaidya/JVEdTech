import express from 'express'
import fs from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const DATA_DIR = path.join(__dirname, 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function appendJson(filename, obj) {
  const p = path.join(DATA_DIR, filename)
  let cur = []
  try { cur = JSON.parse(fs.readFileSync(p, 'utf8') || '[]') } catch (e) { cur = [] }
  cur.push(obj)
  fs.writeFileSync(p, JSON.stringify(cur, null, 2))
}

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })
  const payload = { id: Date.now(), name, email, subject: subject||'', message, date: new Date().toISOString() }
  try {
    appendJson('contacts.json', payload)
    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save' })
  }
})

app.post('/api/register', (req, res) => {
  const { eventId, name, email, phone } = req.body
  if (!eventId || !name || !email) return res.status(400).json({ error: 'Missing required fields' })
  const payload = { id: Date.now(), eventId, name, email, phone: phone||'', date: new Date().toISOString() }
  try {
    appendJson('registrations.json', payload)
    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save' })
  }
})

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

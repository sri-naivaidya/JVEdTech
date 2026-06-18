import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import multer from 'multer'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: fs.existsSync(path.join(__dirname, '..', '.env'))
    ? path.join(__dirname, '..', '.env')
    : path.join(__dirname, '..', '.env.development'),
})

export const app = express()
const PORT = process.env.PORT || 4001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jvedtech'
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-secret-before-production'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const DEFAULT_ADMIN_USERNAME = process.env.DEFAULT_ADMIN_USERNAME || ['Admin', 'Jvedtech'].join('@')
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || ['Jvedtech', 'admin1'].join('@')
const IS_VERCEL = Boolean(process.env.VERCEL)
const UPLOAD_DIR = path.join(__dirname, 'uploads')
const DATA_DIR = path.join(__dirname, 'data')
const USE_JSON_FALLBACK = !IS_VERCEL && process.env.CMS_STORAGE === 'json'

if (!IS_VERCEL && !fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
if (!IS_VERCEL && !fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
if (!IS_VERCEL) {
  app.use('/uploads', express.static(UPLOAD_DIR))
}

mongoose.set('strictQuery', true)
mongoose.set('bufferCommands', false)

const baseOptions = { timestamps: true }

let AdminUser = mongoose.model('AdminUser', new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' },
  name: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  mustChangePassword: { type: Boolean, default: true },
  lastLoginAt: Date,
}, baseOptions))

let Event = mongoose.model('Event', new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: String,
  time: String,
  location: String,
  category: String,
  registrationLink: String,
  eventImage: String,
  status: { type: String, enum: ['draft', 'published', 'unpublished'], default: 'draft' },
}, baseOptions))

let Blog = mongoose.model('Blog', new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, default: 'JV EdTech' },
  category: String,
  publishDate: Date,
  content: String,
  excerpt: String,
  coverImage: String,
  status: { type: String, enum: ['draft', 'published', 'unpublished'], default: 'draft' },
}, baseOptions))

let Newsletter = mongoose.model('Newsletter', new mongoose.Schema({
  title: { type: String, required: true },
  month: String,
  year: String,
  description: String,
  coverImage: String,
  pdfFile: String,
  status: { type: String, enum: ['draft', 'published', 'unpublished'], default: 'draft' },
}, baseOptions))

let Career = mongoose.model('Career', new mongoose.Schema({
  role: { type: String, required: true },
  department: String,
  type: String,
  location: String,
  description: String,
  requirements: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, baseOptions))

let Application = mongoose.model('Application', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  resume: String,
  appliedRole: String,
  status: { type: String, enum: ['new', 'reviewed', 'selected', 'rejected'], default: 'new' },
  date: { type: Date, default: Date.now },
}, baseOptions))

let Registration = mongoose.model('Registration', new mongoose.Schema({
  eventId: String,
  eventName: String,
  name: String,
  email: String,
  phone: String,
  organization: String,
  registrationDate: { type: Date, default: Date.now },
}, baseOptions))

let TeamMember = mongoose.model('TeamMember', new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  profileImage: String,
  linkedin: String,
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
}, baseOptions))

let Message = mongoose.model('Message', new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
}, baseOptions))

let Media = mongoose.model('Media', new mongoose.Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  url: String,
  type: { type: String, enum: ['image', 'pdf', 'file'], default: 'file' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, baseOptions))

let Activity = mongoose.model('Activity', new mongoose.Schema({
  action: String,
  entity: String,
  entityId: String,
  user: String,
}, { timestamps: true }))

let Setting = mongoose.model('Setting', new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: String,
}, baseOptions))

const TEAM_SEED_VERSION = 'team-seed-2026-06-18-v2'
const TEAM_MEMBER_SEED = [
  {
    name: 'Dr. Jyoti Rao',
    designation: 'Co-Founder & CEO',
    profileImage: '/team/dr-jyoti-rao.jpeg',
    linkedin: 'https://www.linkedin.com/in/dr-jyoti-dongre-rao-11520726/',
    order: 1,
    status: 'published',
  },
  {
    name: 'Ms. Marilyn Olivera',
    designation: 'Director Clinical Education and Operations',
    profileImage: '/team/ms-marilyn-olivera.png',
    linkedin: 'https://www.linkedin.com/in/marilynolivera/',
    order: 2,
    status: 'published',
  },
  {
    name: 'Mr. Dinesh Kamble',
    designation: 'Board of Director',
    profileImage: '/team/mr-dinesh-kamble.png',
    linkedin: 'https://www.linkedin.com/in/dinesh-kamble-a409a06b/',
    order: 3,
    status: 'published',
  },
  {
    name: 'Mr. Pravin Nimbolkar',
    designation: 'Board of Director',
    profileImage: '/team/mr-pravin-nimbolkar.jpeg',
    linkedin: '',
    order: 4,
    status: 'published',
  },
  {
    name: 'Bipin Kumar Rathod',
    designation: 'Independent Director - CDIO',
    profileImage: '/team/bipin-kumar-rathod.png',
    linkedin: 'https://www.linkedin.com/in/bipinkumar-rathod-b900b414/',
    order: 5,
    status: 'published',
  },
  {
    name: 'Ms. Nithya Kalyani',
    designation: 'Independent Consultant, HR & Operations',
    profileImage: '/team/ms-nithya-kalyani.png',
    linkedin: 'https://www.linkedin.com/in/nithya-kalyani-pmp-69b027a/',
    order: 6,
    status: 'published',
  },
  {
    name: 'Dr. Annu Bijarnia',
    designation: 'Associate Director - Holistic Well-being',
    profileImage: '/team/dr-annu-bijarnia.png',
    linkedin: 'https://www.linkedin.com/in/dr-annu-bijarnia-pt-77829033/',
    order: 7,
    status: 'published',
  },
  {
    name: 'Ms. Bonti JA',
    designation: 'Strategic Business Consultant',
    profileImage: '/team/ms-bonti-ja.jpeg',
    linkedin: 'https://www.linkedin.com/in/bonti-j-a-39a602aa/',
    order: 8,
    status: 'published',
  },
  {
    name: 'Anreet Kaur',
    designation: 'LMS Operations Lead',
    profileImage: '/team/anreet-kaur.png',
    linkedin: 'https://www.linkedin.com/in/anreetkaur/',
    order: 9,
    status: 'published',
  },
  {
    name: 'Abhineet Priyam',
    designation: 'Strategic Growth Partner',
    profileImage: '/team/abhineet-priyam.jpeg',
    linkedin: 'https://www.linkedin.com/in/abhineet-priyam-8133721a7/',
    order: 10,
    status: 'published',
  },
  {
    name: 'Avinash VK',
    designation: 'Strategic Growth Partner',
    profileImage: '/team/avinash-vk.png',
    linkedin: 'https://www.linkedin.com/in/avinash-v-k/',
    order: 11,
    status: 'published',
  },
  {
    name: 'Sunal Singh',
    designation: 'Business Development Analyst',
    profileImage: '/team/sunal-singh.png',
    linkedin: 'https://www.linkedin.com/in/sunalsingh/',
    order: 12,
    status: 'published',
  },
  {
    name: 'Kushal K',
    designation: 'Compliance & Operations Manager',
    profileImage: '/team/kushal-k.png',
    linkedin: 'https://www.linkedin.com/in/kushal-kavi-86542a130/',
    order: 13,
    status: 'published',
    aliases: ['Kushal Kavi'],
  },
  {
    name: 'Ms. Vinita Deopurkar',
    designation: 'Associate - Clinical Education',
    profileImage: '/team/ms-vinita-deopurkar.jpeg',
    linkedin: 'https://www.linkedin.com/in/vinita-suresh-deopurkar-526a7424/',
    order: 14,
    status: 'published',
  },
  {
    name: 'Skanda Patni',
    designation: 'Clinical Educational Analyst',
    profileImage: '/team/skanda-patni.jpeg',
    linkedin: 'https://www.linkedin.com/in/skanda-patni-875785253/',
    order: 15,
    status: 'published',
  },
  {
    name: 'Khushboo Gupta',
    designation: 'Associate Clinical Education',
    profileImage: '/team/khushboo-gupta.png',
    linkedin: '',
    order: 16,
    status: 'published',
  },
  {
    name: 'Abhiruchi Kunte',
    designation: '',
    profileImage: '/team/abhiruchi-kunte.png',
    linkedin: 'https://www.linkedin.com/in/abhiruchi-kunte-00602b28b/',
    order: 17,
    status: 'published',
  },
  {
    name: 'Shraddha Mishra',
    designation: '',
    profileImage: '/team/shraddha-mishra.png',
    linkedin: 'https://www.linkedin.com/in/shradha16/',
    order: 18,
    status: 'published',
  },
  {
    name: 'Hrishikesh Mishra',
    designation: 'IT Specialist',
    profileImage: '/team/hrishikesh-mishra.jpeg',
    linkedin: '',
    order: 19,
    status: 'published',
  },
]

class JsonQuery {
  constructor(items) {
    this.items = Array.isArray(items) ? [...items] : []
  }

  sort(sortSpec = {}) {
    const [[key, direction] = ['createdAt', -1]] = Object.entries(sortSpec)
    this.items.sort((a, b) => {
      const rawLeft = a[key]
      const rawRight = b[key]
      const leftDate = typeof rawLeft === 'string' ? Date.parse(rawLeft) : NaN
      const rightDate = typeof rawRight === 'string' ? Date.parse(rawRight) : NaN
      const left = typeof rawLeft === 'number' ? rawLeft : Number.isNaN(leftDate) ? String(rawLeft || '') : leftDate
      const right = typeof rawRight === 'number' ? rawRight : Number.isNaN(rightDate) ? String(rawRight || '') : rightDate
      if (typeof left === 'string' || typeof right === 'string') {
        return direction < 0 ? String(right).localeCompare(String(left)) : String(left).localeCompare(String(right))
      }
      return direction < 0 ? right - left : left - right
    })
    return this
  }

  limit(count) {
    this.items = this.items.slice(0, count)
    return this
  }

  then(resolve, reject) {
    return Promise.resolve(this.items).then(resolve, reject)
  }
}

class JsonDocument {
  constructor(model, data) {
    Object.assign(this, data)
    this.__model = model
  }

  async save() {
    await this.__model.saveDocument(this)
    return this
  }

  toJSON() {
    const { __model, ...data } = this
    return data
  }
}

class JsonModel {
  constructor(name) {
    this.name = name
    this.file = path.join(DATA_DIR, `${name}.json`)
    if (!fs.existsSync(this.file)) fs.writeFileSync(this.file, '[]')
  }

  read() {
    try {
      return JSON.parse(fs.readFileSync(this.file, 'utf8'))
    } catch {
      return []
    }
  }

  write(items) {
    fs.writeFileSync(this.file, JSON.stringify(items, null, 2))
  }

  document(item) {
    return item ? new JsonDocument(this, item) : null
  }

  matches(item, query = {}) {
    return Object.entries(query).every(([key, expected]) => {
      if (key === '$or') return expected.some((condition) => this.matches(item, condition))
      const actual = item[key]
      if (expected instanceof RegExp) return expected.test(String(actual || ''))
      return String(actual ?? '') === String(expected ?? '')
    })
  }

  normalize(data) {
    const now = new Date().toISOString()
    return {
      _id: data._id || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now,
    }
  }

  find(query = {}) {
    return new JsonQuery(this.read().filter((item) => this.matches(item, query)).map((item) => this.document(item)))
  }

  async findOne(query = {}) {
    return this.document(this.read().find((item) => this.matches(item, query)))
  }

  async findById(id) {
    return this.document(this.read().find((item) => String(item._id) === String(id)))
  }

  async create(data) {
    const items = this.read()
    const item = this.normalize(data)
    items.push(item)
    this.write(items)
    return this.document(item)
  }

  async insertMany(rows) {
    const items = this.read()
    const docs = rows.map((row) => this.normalize(row))
    this.write([...items, ...docs])
    return docs.map((item) => this.document(item))
  }

  async countDocuments(query = {}) {
    return this.read().filter((item) => this.matches(item, query)).length
  }

  async saveDocument(doc) {
    const data = doc.toJSON ? doc.toJSON() : doc
    const items = this.read()
    const index = items.findIndex((item) => String(item._id) === String(data._id))
    const next = this.normalize(data)
    if (index >= 0) items[index] = next
    else items.push(next)
    this.write(items)
    Object.assign(doc, next)
    return doc
  }

  async findByIdAndUpdate(id, update = {}) {
    const items = this.read()
    const index = items.findIndex((item) => String(item._id) === String(id))
    if (index < 0) return null
    items[index] = this.normalize({ ...items[index], ...update, _id: items[index]._id, createdAt: items[index].createdAt })
    this.write(items)
    return this.document(items[index])
  }

  async findByIdAndDelete(id) {
    const items = this.read()
    const index = items.findIndex((item) => String(item._id) === String(id))
    if (index < 0) return null
    const [deleted] = items.splice(index, 1)
    this.write(items)
    return this.document(deleted)
  }
}

function useJsonStorage() {
  AdminUser = new JsonModel('adminUsers')
  Event = new JsonModel('events')
  Blog = new JsonModel('blogs')
  Newsletter = new JsonModel('newsletters')
  Career = new JsonModel('careers')
  Application = new JsonModel('applications')
  Registration = new JsonModel('registrations')
  TeamMember = new JsonModel('teamMembers')
  Message = new JsonModel('messages')
  Media = new JsonModel('media')
  Activity = new JsonModel('activity')
  Setting = new JsonModel('settings')
}

const storage = IS_VERCEL ? multer.memoryStorage() : multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')
    cb(null, `${Date.now()}-${safeName}`)
  },
})

function rejectLocalUploadsOnVercel(req, res, next) {
  if (!IS_VERCEL) return next()
  return res.status(501).json({ error: 'File uploads require persistent storage in production' })
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    cb(allowed.includes(file.mimetype) ? null : new Error('Unsupported file type'), allowed.includes(file.mimetype))
  },
})

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' },
  )
}

async function seedSuperAdmin() {
  const username = DEFAULT_ADMIN_USERNAME.toLowerCase()
  const exists = await AdminUser.findOne({ username })
  if (exists) return
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12)
  await AdminUser.create({
    username,
    passwordHash,
    role: 'super-admin',
    name: 'Super Admin',
    mustChangePassword: true,
  })
  console.log('Default Super Admin created')
}

async function seedExistingContent() {
  if (await Event.countDocuments() === 0) {
    await Event.insertMany([
      { title: 'Advanced Wound Care & Management Workshop', description: 'A comprehensive hands-on workshop covering advanced wound assessment, dressing techniques, and infection control protocols for healthcare professionals.', date: '2025-07-14', time: '9:00 AM - 5:00 PM', location: 'Mumbai, Maharashtra', category: 'Nursing', status: 'published' },
      { title: 'Home Healthcare Fundamentals Seminar', description: 'Explore the principles of patient-centric home healthcare delivery. Ideal for nurses, caregivers, and allied health professionals.', date: '2025-06-28', time: '10:00 AM - 1:00 PM', location: 'Online - Zoom', category: 'Home Care', status: 'published' },
      { title: 'Medical Ethics & Patient Rights Forum', description: 'An interactive forum addressing contemporary ethical challenges in healthcare, patient rights legislation, and institutional responsibilities.', date: '2025-08-05', time: '2:00 PM - 6:00 PM', location: 'Pune, Maharashtra', category: 'Ethics', status: 'published' },
    ])
  }
  if (await Blog.countDocuments() === 0) {
    await Blog.insertMany([
      { title: 'Building Empathy Through Effective Communication in Healthcare Training', slug: '1', author: 'JV EdTech', category: 'Healthcare', publishDate: '2025-01-17', excerpt: 'Effective communication is fundamental to healthcare, influencing patient outcomes, satisfaction, and the overall efficiency of care delivery.', content: 'Effective communication is fundamental to healthcare, influencing patient outcomes, satisfaction, and the overall efficiency of care delivery.', status: 'published' },
      { title: 'Leveraging AI in Education & Healthcare: Opportunities & Challenges', slug: '2', author: 'JV EdTech', category: 'Technology', publishDate: '2025-01-16', excerpt: 'Artificial Intelligence (AI) is transforming education and healthcare by making processes smarter and more efficient, while also posing challenges that need careful attention.', content: 'Artificial Intelligence (AI) is transforming education and healthcare by making processes smarter and more efficient, while also posing challenges that need careful attention.', status: 'published' },
      { title: 'The Future of EdTech in Healthcare: Trends & Innovation', slug: '3', author: 'JV EdTech', category: 'Education Technology', publishDate: '2025-01-16', excerpt: 'EdTech is reshaping healthcare education through tools like AR, VR, AI, and remote learning platforms, creating new opportunities for accessibility and personalized learning.', content: 'EdTech is reshaping healthcare education through tools like AR, VR, AI, and remote learning platforms, creating new opportunities for accessibility and personalized learning.', status: 'published' },
    ])
  }
  if (await Newsletter.countDocuments() === 0) {
    await Newsletter.insertMany([
      { title: 'JVEDTech Medovation Newsletter', month: 'September', year: '2024', pdfFile: 'https://drive.google.com/file/d/1FhXAMIN3n7kAfayrDPZbR4mQJYnu-dau/view?usp=sharing', status: 'published' },
      { title: 'JVEDTech Medovation Newsletter', month: 'December', year: '2024', pdfFile: 'https://drive.google.com/file/d/1TE0pbSB-veuIAoQ0NfE_WRYgnUQrzFx1/view?usp=sharing', status: 'published' },
      { title: 'JVEDTech Medovation Newsletter', month: 'April', year: '2025', pdfFile: 'https://drive.google.com/file/d/12Mhv990u5ff4hTCUKeCGq16jLgVxHQH8/view?usp=sharing', status: 'published' },
      { title: 'JVEDTech Medovation Newsletter', month: 'July', year: '2025', pdfFile: 'https://drive.google.com/file/d/1gnuTiYQICZ3K9Jpdo07HUQtHT-JV4GyK/view?usp=drive_link', status: 'published' },
      { title: 'JVEDTech Medovation Newsletter', month: 'October', year: '2025', pdfFile: 'https://drive.google.com/file/d/1hX_Ld2lZcQoZtBfhoKfcebgiZwsx8igZ/view?usp=drivesdk', status: 'published' },
      { title: 'JVEDTech Medovation Newsletter', month: 'December', year: '2025', pdfFile: 'https://drive.google.com/file/d/1ngxqN33v9rvN3Fx-DqDMBVBL8ddyRF2c/view?usp=drivesdk', status: 'published' },
    ])
  }
  if (await Career.countDocuments() === 0) {
    await Career.insertMany([
      { role: 'Business Analyst', department: 'Business', type: 'Full-Time / Part-Time', location: 'Mumbai', description: 'Identify growth opportunities, analyse market trends, and drive data-informed decisions across our healthcare programmes.', requirements: 'Data Analysis\nStrategic Planning\nStakeholder Management\nReporting', status: 'open' },
      { role: 'Social Media Analyst', department: 'Marketing', type: 'Full-Time / Part-Time', location: 'Mumbai', description: 'Manage our online presence, craft compelling health-awareness content, monitor engagement metrics, and grow our digital community.', requirements: 'Content Strategy\nAnalytics\nCommunity Management\nGraphic Tools', status: 'open' },
      { role: 'Clinical Education Analyst', department: 'Clinical', type: 'Full-Time / Part-Time', location: 'Mumbai', description: 'Design, deliver, and evaluate training programmes for clinical staff, ensuring teams stay at the forefront of evidence-based practice.', requirements: 'Curriculum Design\nClinical Knowledge\nE-Learning\nAssessment', status: 'open' },
    ])
  }
  await syncTeamMembersFromAdminSeed()
}

async function syncTeamMembersFromAdminSeed() {
  const done = await Setting.findOne({ key: TEAM_SEED_VERSION })
  if (done) return

  for (const member of TEAM_MEMBER_SEED) {
    const { aliases = [], ...record } = member
    let existing = await TeamMember.findOne({ name: record.name })
    for (const alias of aliases) {
      if (!existing) existing = await TeamMember.findOne({ name: alias })
    }
    if (existing) {
      Object.assign(existing, {
        ...record,
        _id: existing._id,
        createdAt: existing.createdAt,
      })
      await existing.save()
    } else {
      await TeamMember.create(record)
    }
  }

  await Setting.create({ key: TEAM_SEED_VERSION, value: 'done' })
}

async function logActivity(action, entity, entityId, user) {
  try {
    await Activity.create({ action, entity, entityId, user: user?.username || 'system' })
  } catch (error) {
    console.warn('Activity log failed', error.message)
  }
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Authentication required' })
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await AdminUser.findById(payload.id)
    if (!user || user.disabled) return res.status(401).json({ error: 'Account unavailable' })
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.user?.role !== 'super-admin') return res.status(403).json({ error: 'Super Admin access required' })
  next()
}

function serializeUser(user) {
  return {
    id: user._id,
    username: user.username,
    role: user.role,
    name: user.name,
    disabled: user.disabled,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt,
  }
}

function validateNewPassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number'
  }
  return ''
}

function crudRoutes(pathName, getModel, entityName, { publicFilter = null, adminSort = { createdAt: -1 }, publicSort = { createdAt: -1 } } = {}) {
  app.get(`/api/admin/${pathName}`, requireAuth, async (req, res) => {
    const Model = getModel()
    const items = await Model.find().sort(adminSort)
    res.json(items)
  })

  app.post(`/api/admin/${pathName}`, requireAuth, async (req, res) => {
    const Model = getModel()
    const item = await Model.create(req.body)
    await logActivity('created', entityName, item._id.toString(), req.user)
    res.status(201).json(item)
  })

  app.put(`/api/admin/${pathName}/:id`, requireAuth, async (req, res) => {
    const Model = getModel()
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!item) return res.status(404).json({ error: `${entityName} not found` })
    await logActivity('updated', entityName, item._id.toString(), req.user)
    res.json(item)
  })

  app.delete(`/api/admin/${pathName}/:id`, requireAuth, async (req, res) => {
    const Model = getModel()
    const item = await Model.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ error: `${entityName} not found` })
    await logActivity('deleted', entityName, item._id.toString(), req.user)
    res.json({ ok: true })
  })

  app.patch(`/api/admin/${pathName}/:id/status`, requireAuth, async (req, res) => {
    const Model = getModel()
    const item = await Model.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!item) return res.status(404).json({ error: `${entityName} not found` })
    await logActivity('status-updated', entityName, item._id.toString(), req.user)
    res.json(item)
  })

  app.get(`/api/public/${pathName}`, async (req, res) => {
    const Model = getModel()
    const query = publicFilter || { status: 'published' }
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    const items = await Model.find(query).sort(publicSort)
    res.json(items)
  })
}

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body.username || '').toLowerCase().trim()
  const password = String(req.body.password || '')
  const user = await AdminUser.findOne({ username })
  if (!user || user.disabled) return res.status(401).json({ error: 'Invalid username or password' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' })
  user.lastLoginAt = new Date()
  await user.save()
  res.json({ token: signToken(user), user: serializeUser(user) })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: serializeUser(req.user) })
})

app.post('/api/auth/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const passwordError = validateNewPassword(String(newPassword || ''))
  if (passwordError) return res.status(400).json({ error: passwordError })
  const ok = await bcrypt.compare(currentPassword || '', req.user.passwordHash)
  if (!ok) return res.status(400).json({ error: 'Current password is incorrect' })
  req.user.passwordHash = await bcrypt.hash(newPassword, 12)
  req.user.mustChangePassword = false
  await req.user.save()
  await logActivity('changed-password', 'admin-user', req.user._id.toString(), req.user)
  res.json({ user: serializeUser(req.user), token: signToken(req.user) })
})

app.get('/api/admin/admins', requireAuth, requireSuperAdmin, async (req, res) => {
  const users = await AdminUser.find().sort({ createdAt: -1 })
  res.json(users.map(serializeUser))
})

app.post('/api/admin/admins', requireAuth, requireSuperAdmin, async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password || 'ChangeMe123!', 12)
  const user = await AdminUser.create({
    username: String(req.body.username || '').toLowerCase().trim(),
    name: req.body.name || '',
    role: req.body.role === 'super-admin' ? 'super-admin' : 'admin',
    passwordHash,
    mustChangePassword: true,
  })
  await logActivity('created', 'admin-user', user._id.toString(), req.user)
  res.status(201).json(serializeUser(user))
})

app.put('/api/admin/admins/:id', requireAuth, requireSuperAdmin, async (req, res) => {
  const user = await AdminUser.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    role: req.body.role,
    disabled: Boolean(req.body.disabled),
  }, { new: true })
  if (!user) return res.status(404).json({ error: 'Admin not found' })
  await logActivity('updated', 'admin-user', user._id.toString(), req.user)
  res.json(serializeUser(user))
})

app.post('/api/admin/admins/:id/reset-password', requireAuth, requireSuperAdmin, async (req, res) => {
  const user = await AdminUser.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'Admin not found' })
  user.passwordHash = await bcrypt.hash(req.body.password || 'ChangeMe123!', 12)
  user.mustChangePassword = true
  await user.save()
  await logActivity('reset-password', 'admin-user', user._id.toString(), req.user)
  res.json(serializeUser(user))
})

crudRoutes('events', () => Event, 'event')
crudRoutes('blogs', () => Blog, 'blog')
crudRoutes('newsletters', () => Newsletter, 'newsletter')
crudRoutes('careers', () => Career, 'career', { publicFilter: { status: 'open' } })
crudRoutes('team', () => TeamMember, 'team-member', {
  publicFilter: { status: 'published' },
  adminSort: { order: 1 },
  publicSort: { order: 1 },
})

app.get('/api/public/blogs/:slug', async (req, res) => {
  const item = await Blog.findOne({ slug: req.params.slug, status: 'published' })
  if (!item) return res.status(404).json({ error: 'Blog not found' })
  res.json(item)
})

app.get('/api/admin/dashboard', requireAuth, async (req, res) => {
  const [
    totalEvents,
    totalBlogs,
    totalNewsletters,
    totalCareerOpenings,
    totalApplications,
    totalEventRegistrations,
    totalAdminUsers,
    recentActivity,
  ] = await Promise.all([
    Event.countDocuments(),
    Blog.countDocuments(),
    Newsletter.countDocuments(),
    Career.countDocuments({ status: 'open' }),
    Application.countDocuments(),
    Registration.countDocuments(),
    AdminUser.countDocuments(),
    Activity.find().sort({ createdAt: -1 }).limit(8),
  ])
  res.json({
    totalEvents,
    totalBlogs,
    totalNewsletters,
    totalCareerOpenings,
    totalApplications,
    totalEventRegistrations,
    totalAdminUsers,
    recentActivity,
  })
})

app.post('/api/media/upload', requireAuth, rejectLocalUploadsOnVercel, upload.single('file'), async (req, res) => {
  const media = await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/${req.file.filename}`,
    type: req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype === 'application/pdf' ? 'pdf' : 'file',
    uploadedBy: req.user._id,
  })
  await logActivity('uploaded', 'media', media._id.toString(), req.user)
  res.status(201).json(media)
})

app.get('/api/admin/media', requireAuth, async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 })
  res.json(media)
})

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })
  const payload = await Message.create({ name, email, subject: subject || '', message, date: new Date() })
  res.json({ ok: true, id: payload._id })
})

app.post('/api/register', async (req, res) => {
  const { eventId, eventName, name, email, phone, organization } = req.body
  if (!name || !email || (!eventId && !eventName)) return res.status(400).json({ error: 'Missing required fields' })
  const payload = await Registration.create({ eventId, eventName, name, email, phone, organization })
  res.json({ ok: true, id: payload._id })
})

app.post('/api/applications', rejectLocalUploadsOnVercel, upload.single('resume'), async (req, res) => {
  const { name, email, phone, appliedRole } = req.body
  if (!name || !email || !appliedRole) return res.status(400).json({ error: 'Missing required fields' })
  const payload = await Application.create({
    name,
    email,
    phone,
    appliedRole,
    resume: req.file ? `/uploads/${req.file.filename}` : '',
  })
  res.json({ ok: true, id: payload._id })
})

app.get('/api/admin/applications', requireAuth, async (req, res) => {
  const query = {}
  if (req.query.role) query.appliedRole = req.query.role
  if (req.query.search) query.$or = [
    { name: new RegExp(req.query.search, 'i') },
    { email: new RegExp(req.query.search, 'i') },
  ]
  res.json(await Application.find(query).sort({ createdAt: -1 }))
})

app.patch('/api/admin/applications/:id/status', requireAuth, async (req, res) => {
  const item = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (!item) return res.status(404).json({ error: 'Application not found' })
  res.json(item)
})

app.get('/api/admin/registrations', requireAuth, async (req, res) => {
  const query = {}
  if (req.query.eventName) query.eventName = req.query.eventName
  if (req.query.search) query.$or = [
    { name: new RegExp(req.query.search, 'i') },
    { email: new RegExp(req.query.search, 'i') },
    { organization: new RegExp(req.query.search, 'i') },
  ]
  res.json(await Registration.find(query).sort({ createdAt: -1 }))
})

function formatDate(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

app.get('/api/admin/registrations/export.csv', requireAuth, async (req, res) => {
  const rows = await Registration.find().sort({ createdAt: -1 })
  const csv = ['Name,Email,Phone,Organization,Event,Registration Date']
  rows.forEach((row) => {
    csv.push([row.name, row.email, row.phone, row.organization, row.eventName, formatDate(row.registrationDate)].map((v) => `"${String(v || '').replace(/"/g, '""')}"`).join(','))
  })
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"')
  res.send(csv.join('\n'))
})

app.get('/api/admin/registrations/export.xls', requireAuth, async (req, res) => {
  const rows = await Registration.find().sort({ createdAt: -1 })
  const escapeXml = (value) => String(value || '').replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[char])
  const tableRows = [
    ['Name', 'Email', 'Phone', 'Organization', 'Event', 'Registration Date'],
    ...rows.map((row) => [row.name, row.email, row.phone, row.organization, row.eventName, formatDate(row.registrationDate)]),
  ]
  const xmlRows = tableRows.map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join('')}</Row>`).join('')
  const workbook = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Registrations"><Table>${xmlRows}</Table></Worksheet></Workbook>`
  res.setHeader('Content-Type', 'application/vnd.ms-excel')
  res.setHeader('Content-Disposition', 'attachment; filename="registrations.xls"')
  res.send(workbook)
})

app.get('/api/admin/messages', requireAuth, async (req, res) => {
  const query = {}
  if (req.query.search) query.$or = [
    { name: new RegExp(req.query.search, 'i') },
    { email: new RegExp(req.query.search, 'i') },
    { subject: new RegExp(req.query.search, 'i') },
  ]
  res.json(await Message.find(query).sort({ createdAt: -1 }))
})

app.patch('/api/admin/messages/:id/read', requireAuth, async (req, res) => {
  const item = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
  if (!item) return res.status(404).json({ error: 'Message not found' })
  res.json(item)
})

let storageMode = 'mongodb'

app.get('/api/health', (req, res) => res.json({ status: 'ok', storage: storageMode }))

app.use((error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500).json({ error: error.message || 'Server error' })
})

let initPromise

export async function initializeServer() {
  if (initPromise) return initPromise

  initPromise = (async () => {
  if (USE_JSON_FALLBACK) {
    storageMode = 'json'
    useJsonStorage()
    console.log('CMS storage: local JSON fallback')
  } else {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
      storageMode = 'mongodb'
      console.log('CMS storage: MongoDB')
    } catch (error) {
      if (IS_VERCEL) {
        throw new Error(`MongoDB connection failed in production: ${error.message}`)
      }
      storageMode = 'json'
      useJsonStorage()
      console.warn(`MongoDB unavailable, using local JSON fallback: ${error.message}`)
    }
  }

  await seedSuperAdmin()
  await seedExistingContent()
  })()

  return initPromise
}

async function startServer() {
  await initializeServer()
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer().catch((error) => {
    console.error('Server startup failed', error)
    process.exit(1)
  })
}

import { useEffect, useMemo, useState } from 'react'
import { API_BASE, apiFetch, clearAdminSession, getAdminToken, setAdminToken } from '../utils/api'
import Button from './ui/Button'
import Input, { Select, Textarea } from './ui/Input'

const NAV = [
  ['Overview', 'overview'],
  ['Events', 'events'],
  ['Blogs', 'blogs'],
  ['Newsletters', 'newsletters'],
  ['Careers', 'careers'],
  ['Applications', 'applications'],
  ['Registrations', 'registrations'],
  ['Team', 'team'],
  ['Messages', 'messages'],
  ['Media', 'media'],
  ['Admins', 'admins', 'super-admin'],
]

const CONFIG = {
  events: {
    title: 'Events',
    endpoint: '/api/admin/events',
    fields: [
      ['title', 'Title'],
      ['description', 'Description', 'textarea'],
      ['date', 'Date', 'date'],
      ['time', 'Time'],
      ['location', 'Location'],
      ['category', 'Category'],
      ['registrationLink', 'Registration Link'],
      ['eventImage', 'Event Image URL'],
      ['status', 'Status', 'select', ['draft', 'published', 'unpublished']],
    ],
    columns: ['title', 'date', 'location', 'status'],
  },
  blogs: {
    title: 'Blogs',
    endpoint: '/api/admin/blogs',
    fields: [
      ['title', 'Title'],
      ['slug', 'Slug'],
      ['author', 'Author'],
      ['category', 'Category'],
      ['publishDate', 'Publish Date', 'date'],
      ['excerpt', 'Excerpt', 'textarea'],
      ['content', 'Rich Text Content', 'textarea'],
      ['coverImage', 'Cover Image URL'],
      ['status', 'Status', 'select', ['draft', 'published', 'unpublished']],
    ],
    columns: ['title', 'author', 'category', 'status'],
  },
  newsletters: {
    title: 'Newsletters',
    endpoint: '/api/admin/newsletters',
    fields: [
      ['title', 'Title'],
      ['month', 'Month'],
      ['year', 'Year'],
      ['description', 'Description', 'textarea'],
      ['coverImage', 'Cover Image URL'],
      ['pdfFile', 'PDF File URL'],
      ['status', 'Status', 'select', ['draft', 'published', 'unpublished']],
    ],
    columns: ['title', 'month', 'year', 'status'],
  },
  careers: {
    title: 'Careers',
    endpoint: '/api/admin/careers',
    fields: [
      ['role', 'Role'],
      ['department', 'Department'],
      ['type', 'Type'],
      ['location', 'Location'],
      ['description', 'Description', 'textarea'],
      ['requirements', 'Requirements', 'textarea'],
      ['status', 'Status', 'select', ['open', 'closed']],
    ],
    columns: ['role', 'department', 'type', 'status'],
  },
  team: {
    title: 'Team Members',
    endpoint: '/api/admin/team',
    fields: [
      ['name', 'Name'],
      ['designation', 'Designation'],
      ['profileImage', 'Profile Image URL'],
      ['linkedin', 'LinkedIn URL'],
      ['order', 'Order', 'number'],
      ['status', 'Status', 'select', ['published', 'draft']],
    ],
    columns: ['name', 'designation', 'status'],
  },
}

function pageFromPath(path) {
  if (!path?.startsWith('/admin')) return 'overview'
  return path.replace('/admin/', '') || 'overview'
}

function EmptyState({ title }) {
  return (
    <div className="admin-empty">
      <p>{title}</p>
      <span>Content created here will update the public website automatically.</span>
    </div>
  )
}

function Toast({ message }) {
  if (!message) return null
  return <div className="admin-toast">{message}</div>
}

function PasswordField({ value, onChange, placeholder = 'Password', autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="admin-password-field">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="admin-password-toggle"
        onClick={() => setVisible((next) => !next)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.5 5.4A9.8 9.8 0 0 1 12 5c5.5 0 9 5.4 9 7 0 .7-.6 1.8-1.7 3" />
            <path d="M6.7 6.7C4.4 8.2 3 10.8 3 12c0 1.6 3.5 7 9 7 1.6 0 3-.4 4.2-1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        )}
      </button>
    </div>
  )
}

function AdminLogin({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', currentPassword: '', newPassword: '' })
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'change') {
        const data = await apiFetch('/api/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
        })
        setAdminToken(data.token)
        setForm({ username: '', password: '', currentPassword: '', newPassword: '' })
        onLogin(data.user)
        return
      }
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      setAdminToken(data.token)
      if (data.user.mustChangePassword) {
        setUser(data.user)
        setMode('change')
        setForm({ username: '', password: '', currentPassword: '', newPassword: '' })
      } else {
        setForm({ username: '', password: '', currentPassword: '', newPassword: '' })
        onLogin(data.user)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit} className="admin-login-card" autoComplete="on">
      <span className="admin-kicker">JV EdTech CMS</span>
      <h1>{mode === 'change' ? 'Change password' : 'Admin login'}</h1>
      <p>{mode === 'change' ? `Welcome ${user?.username}. Create a new password to continue.` : 'Secure access for website content management inside the current website.'}</p>
      {mode === 'login' ? (
        <>
          <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" autoComplete="username" />
          <PasswordField value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </>
      ) : (
        <>
          <Input value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} placeholder="Current Password" type="password" autoComplete="current-password" />
          <Input value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="New Password" type="password" autoComplete="new-password" />
        </>
      )}
      {error && <div className="admin-error">{error}</div>}
      <Button type="submit" className="w-full">{mode === 'change' ? 'Update Password' : 'Login'}</Button>
    </form>
  )
}

function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    apiFetch('/api/admin/dashboard').then(setData).catch(() => setData({}))
  }, [])

  const cards = [
    ['Total Events', data?.totalEvents],
    ['Total Blogs', data?.totalBlogs],
    ['Total Newsletters', data?.totalNewsletters],
    ['Career Openings', data?.totalCareerOpenings],
    ['Applications', data?.totalApplications],
    ['Event Registrations', data?.totalEventRegistrations],
    ['Admin Users', data?.totalAdminUsers],
  ]

  return (
    <section>
      <div className="admin-page-header">
        <span className="admin-kicker">Overview</span>
        <h1>Dashboard</h1>
        <p>Manage the JV EdTech website from one premium control center.</p>
      </div>
      <div className="admin-stats-grid">
        {cards.map(([label, value]) => (
          <div key={label} className="admin-stat-card">
            <span>{label}</span>
            <strong>{value ?? '...'}</strong>
          </div>
        ))}
      </div>
      <div className="admin-panel-card mt-6">
        <h2>Recent Activity</h2>
        {data?.recentActivity?.length ? data.recentActivity.map((item) => (
          <div key={item._id} className="admin-activity-row">
            <span>{item.action}</span>
            <strong>{item.entity}</strong>
            <small>{new Date(item.createdAt).toLocaleString()}</small>
          </div>
        )) : <EmptyState title="No recent activity yet." />}
      </div>
    </section>
  )
}

function ContentManager({ type }) {
  const config = CONFIG[type]
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  const load = () => apiFetch(config.endpoint).then(setItems)
  useEffect(() => { load() }, [type])

  const filtered = useMemo(() => items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())), [items, search])

  async function save(e) {
    e.preventDefault()
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries())
    const method = editing?._id ? 'PUT' : 'POST'
    const url = editing?._id ? `${config.endpoint}/${editing._id}` : config.endpoint
    await apiFetch(url, { method, body: JSON.stringify(payload) })
    setEditing(null)
    setToast('Saved successfully')
    await load()
  }

  async function remove(id) {
    await apiFetch(`${config.endpoint}/${id}`, { method: 'DELETE' })
    setToast('Deleted successfully')
    await load()
  }

  return (
    <section>
      <Toast message={toast} />
      <div className="admin-page-header">
        <span className="admin-kicker">Content</span>
        <h1>{config.title}</h1>
        <p>Create, edit, publish, and maintain website content.</p>
      </div>
      <div className="admin-content-grid">
        <form onSubmit={save} className="admin-panel-card admin-form">
          <h2>{editing ? 'Edit' : 'Create'} {config.title.slice(0, -1)}</h2>
          {config.fields.map(([name, label, fieldType = 'text', options]) => (
            <label key={name}>
              <span>{label}</span>
              {fieldType === 'textarea' ? (
                <Textarea name={name} defaultValue={editing?.[name] || ''} rows={4} />
              ) : fieldType === 'select' ? (
                <Select name={name} defaultValue={editing?.[name] || options[0]}>
                  {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </Select>
              ) : (
                <Input name={name} type={fieldType} defaultValue={editing?.[name] || ''} />
              )}
            </label>
          ))}
          <div className="admin-form-actions">
            <Button type="submit">Save</Button>
            {editing && <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>}
          </div>
        </form>

        <div className="admin-panel-card">
          <div className="admin-table-toolbar">
            <h2>{config.title}</h2>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
          </div>
          {filtered.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>{config.columns.map((col) => <th key={col}>{col}</th>)}<th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id}>
                      {config.columns.map((col) => <td key={col}>{item[col]}</td>)}
                      <td>
                        <button onClick={() => setEditing(item)}>Edit</button>
                        <button onClick={() => remove(item._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState title={`No ${config.title.toLowerCase()} found.`} />}
        </div>
      </div>
    </section>
  )
}

function ListManager({ title, endpoint, columns, statusEndpoint }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const load = () => apiFetch(endpoint).then(setItems)
  useEffect(() => { load() }, [endpoint])
  const filtered = items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))

  async function setStatus(id, status) {
    await apiFetch(`${statusEndpoint || endpoint}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    await load()
  }

  async function download(format) {
    const token = getAdminToken()
    const response = await fetch(`${API_BASE}/api/admin/registrations/export.${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `registrations.${format}`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section>
      <div className="admin-page-header"><span className="admin-kicker">Records</span><h1>{title}</h1></div>
      <div className="admin-panel-card">
        <div className="admin-table-toolbar">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
          {title === 'Registrations' && (
            <div className="admin-form-actions">
              <Button type="button" variant="secondary" onClick={() => download('csv')}>Export CSV</Button>
              <Button type="button" variant="secondary" onClick={() => download('xls')}>Export Excel</Button>
            </div>
          )}
        </div>
        {filtered.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr>{columns.map((col) => <th key={col}>{col}</th>)}<th>Status</th></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    {columns.map((col) => <td key={col}>{item[col] || item[col.toLowerCase()]}</td>)}
                    <td>
                      {'status' in item && ['reviewed', 'selected', 'rejected'].map((s) => (
                        <button key={s} onClick={() => setStatus(item._id, s)}>{s}</button>
                      ))}
                      {'read' in item && !item.read && <button onClick={() => apiFetch(`${endpoint}/${item._id}/read`, { method: 'PATCH' }).then(load)}>Mark Read</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title={`No ${title.toLowerCase()} yet.`} />}
      </div>
    </section>
  )
}

function MediaLibrary() {
  const [items, setItems] = useState([])
  const [toast, setToast] = useState('')
  const load = () => apiFetch('/api/admin/media').then(setItems)
  useEffect(() => { load() }, [])

  async function upload(e) {
    e.preventDefault()
    const file = e.currentTarget.file.files[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    await apiFetch('/api/media/upload', { method: 'POST', body: form, headers: {} })
    setToast('Uploaded successfully')
    e.currentTarget.reset()
    await load()
  }

  return (
    <section>
      <Toast message={toast} />
      <div className="admin-page-header"><span className="admin-kicker">Media</span><h1>Media Library</h1><p>Upload reusable images and PDFs.</p></div>
      <form onSubmit={upload} className="admin-panel-card admin-upload">
        <input name="file" type="file" accept="image/*,application/pdf" />
        <Button type="submit">Upload</Button>
      </form>
      <div className="admin-media-grid">
        {items.map((item) => (
          <div key={item._id} className="admin-media-card">
            <strong>{item.originalName}</strong>
            <span>{item.type}</span>
            <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
          </div>
        ))}
      </div>
    </section>
  )
}

function AdminUsers() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const load = () => apiFetch('/api/admin/admins').then(setItems)
  useEffect(() => { load() }, [])

  async function save(e) {
    e.preventDefault()
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries())
    const editingId = editing?._id || editing?.id
    await apiFetch(editingId ? `/api/admin/admins/${editingId}` : '/api/admin/admins', {
      method: editingId ? 'PUT' : 'POST',
      body: JSON.stringify({ ...payload, disabled: payload.disabled === 'on' }),
    })
    setEditing(null)
    await load()
  }

  return (
    <section>
      <div className="admin-page-header"><span className="admin-kicker">Security</span><h1>Admin Users</h1></div>
      <div className="admin-content-grid">
        <form onSubmit={save} className="admin-panel-card admin-form">
          <Input required name="username" placeholder="Email / Username" defaultValue={editing?.username || ''} disabled={Boolean(editing)} />
          <Input name="name" placeholder="Name" defaultValue={editing?.name || ''} />
          {!editing && <Input required name="password" type="password" placeholder="Temporary Password" />}
          <Select name="role" defaultValue={editing?.role || 'admin'}>
            <option value="admin">Admin</option>
            <option value="super-admin">Super Admin</option>
          </Select>
          {editing && <label className="admin-checkbox"><input type="checkbox" name="disabled" defaultChecked={editing.disabled} /> Disabled</label>}
          <Button type="submit">Save Admin</Button>
        </form>
        <div className="admin-panel-card">
          <table className="admin-table"><tbody>{items.map((item) => (
            <tr key={item.id}>
              <td>{item.username}</td><td>{item.role}</td><td>{item.disabled ? 'Disabled' : 'Active'}</td>
              <td><button onClick={() => setEditing(item)}>Edit</button><button onClick={() => {
                const password = prompt('New temporary password')
                if (password) apiFetch(`/api/admin/admins/${item.id}/reset-password`, { method: 'POST', body: JSON.stringify({ password }) }).then(load)
              }}>Reset</button></td>
            </tr>
          ))}</tbody></table>
        </div>
      </div>
    </section>
  )
}

export default function AdminPanel({ currentPath, isOpen = false, onClose }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [page, setPage] = useState(() => pageFromPath(currentPath))

  useEffect(() => {
    if (!isOpen) return
    setChecking(true)
    apiFetch('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => {
        clearAdminSession()
        setUser(null)
      })
      .finally(() => setChecking(false))
  }, [isOpen])

  useEffect(() => {
    if (currentPath?.startsWith('/admin')) {
      setPage(pageFromPath(currentPath))
    }
  }, [currentPath])

  if (!isOpen) return null

  const loginLayer = (content) => (
    <div className="admin-layer" role="dialog" aria-modal="true" aria-label="Admin login">
      <button className="admin-layer-backdrop" type="button" aria-label="Close admin login" onClick={onClose} />
      <section className="admin-layer-login">
        <button className="admin-layer-close" type="button" onClick={onClose}>Close</button>
        {content}
      </section>
    </div>
  )

  if (checking) return loginLayer(<div className="admin-login-card">Loading...</div>)
  if (!user) return loginLayer(<AdminLogin onLogin={setUser} />)

  const canSee = (item) => !item[2] || item[2] === user.role
  const logout = () => {
    clearAdminSession()
    setUser(null)
    setPage('overview')
  }

  return (
    <div className="admin-layer" role="dialog" aria-modal="true" aria-label="JV EdTech admin management layer">
      <button className="admin-layer-backdrop" type="button" aria-label="Close admin controls" onClick={onClose} />
      <main className="admin-shell admin-layer-panel">
        <header className="admin-layer-topbar">
          <div>
            <span className="admin-kicker">Secure management layer</span>
            <strong>Manage JV EdTech content without leaving the website</strong>
          </div>
          <button className="admin-layer-close" type="button" onClick={onClose}>Close</button>
        </header>
        <div className="admin-layer-body">
          <aside className="admin-sidebar">
            <div className="admin-brand">JV<span>Admin</span></div>
            <nav>
              {NAV.filter(canSee).map(([label, nextPage]) => (
                <button
                  key={nextPage}
                  type="button"
                  onClick={() => setPage(nextPage)}
                  className={page === nextPage ? 'active' : ''}
                >
                  {label}
                </button>
              ))}
            </nav>
            <button onClick={logout}>Logout</button>
          </aside>
          <section className="admin-main">
            {page === 'overview' && <Dashboard />}
            {CONFIG[page] && <ContentManager type={page} />}
            {page === 'applications' && <ListManager title="Applications" endpoint="/api/admin/applications" columns={['name', 'email', 'phone', 'appliedRole']} />}
            {page === 'registrations' && <ListManager title="Registrations" endpoint="/api/admin/registrations" columns={['name', 'email', 'phone', 'organization', 'eventName']} />}
            {page === 'messages' && <ListManager title="Messages" endpoint="/api/admin/messages" columns={['name', 'email', 'subject', 'message']} />}
            {page === 'media' && <MediaLibrary />}
            {page === 'admins' && user.role === 'super-admin' && <AdminUsers />}
          </section>
        </div>
      </main>
    </div>
  )
}

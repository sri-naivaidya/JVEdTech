export const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('jvedtech_admin_token')
  const headers = { ...(options.headers || {}) }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }
  return data
}

export async function publicFetch(path, fallback) {
  try {
    return await apiFetch(path)
  } catch (error) {
    return fallback
  }
}

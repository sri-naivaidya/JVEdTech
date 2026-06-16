export const API_BASE = import.meta.env?.VITE_API_BASE || ''
export const ADMIN_TOKEN_KEY = 'jvedtech_admin_token'
const AUTH_STORAGE_PATTERNS = ['jvedtech_admin', 'admin_token', 'auth_token', 'jwt']

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminSession() {
  const clearMatchingKeys = (storage) => {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index)
      if (key && AUTH_STORAGE_PATTERNS.some((pattern) => key.toLowerCase().includes(pattern))) {
        storage.removeItem(key)
      }
    }
  }

  localStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  clearMatchingKeys(localStorage)
  clearMatchingKeys(sessionStorage)
}

export async function apiFetch(path, options = {}) {
  const token = getAdminToken()
  const headers = { ...(options.headers || {}) }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('Unable to connect to server')
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(data?.error || 'Invalid username or password')
    }
    if (data?.error) {
      throw new Error(data.error)
    }
    throw new Error(response.status >= 500 ? 'Server error. Please try again.' : 'Unable to complete request')
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

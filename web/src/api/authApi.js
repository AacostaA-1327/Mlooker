import api from './client'

export async function login(username, password) {
  const { data } = await api.post('/api/v1/auth/login', { username, password })
  return data
}

export async function fetchMe() {
  const { data } = await api.get('/api/v1/auth/me')
  return data
}

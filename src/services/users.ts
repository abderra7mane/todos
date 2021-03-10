import { apiPost } from "./utils"


let _authToken = null
let _displayName = null


export function getSessionToken() {
  return _authToken || (_authToken = sessionStorage.getItem('__auth_token'))
}

export function getDisplayName() {
  return _displayName || (_displayName = sessionStorage.getItem('__display_name'))
}

export function isAuthenticated() {
  return !!getSessionToken()
}

export function clearSessionData() {
  _authToken = null
  _displayName = null
  sessionStorage.removeItem('__auth_token')
  sessionStorage.removeItem('__display_name')
}

export function register(user: any) {
  return apiPost('/api/auth/signup', user)
    .then(({ data }) => data.data)
}

export function authenticate(user: any) {
  return apiPost('/api/auth/signin', user)
    .then(({ data }) => {
      setSessionToken(data.token)
      setDisplayName(data.name)
    })
}

function setSessionToken(token: string) {
  sessionStorage.setItem('__auth_token', _authToken = token)
}

function setDisplayName(name: string) {
  sessionStorage.setItem('__display_name', _displayName = name)
}

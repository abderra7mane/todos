import { apiPost } from "./utils"


let _authToken = null


export function getSessionToken() {
  return _authToken || (_authToken = sessionStorage.getItem('__auth_token'))
}

export function isAuthenticated() {
  return !!getSessionToken()
}

export function clearSessionToken() {
  sessionStorage.removeItem('__auth_token')
  _authToken = null
}

export function register(user: any) {
  return apiPost('/api/auth/signup', user)
    .then(({ data }) => data.data)
}

export function authenticate(user: any) {
  return apiPost('/api/auth/signin', user)
    .then(({ data }) => {
      setSessionToken(data.token)
    })
}

function setSessionToken(token: string) {
  sessionStorage.setItem('__auth_token', _authToken = token)
}

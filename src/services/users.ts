import { apiPost } from "./utils"


let _authToken = null
let _displayName = null


export function getSessionToken() {
  if ( _authToken ) 
    return _authToken
  else if ( typeof window !== 'undefined' )
    return (_authToken = sessionStorage.getItem('__auth_token'))
}

export function getDisplayName() {
  if ( _displayName ) 
    return _displayName
  else if ( typeof window !== 'undefined' )
    return (_displayName = sessionStorage.getItem('__display_name'))
}

export function isAuthenticated() {
  return !!getSessionToken()
}

export function clearSessionData() {
  _authToken = null
  _displayName = null
  
  if ( typeof window !== 'undefined' ) {
    sessionStorage.removeItem('__auth_token')
    sessionStorage.removeItem('__display_name')
  }
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
  if ( typeof window !== 'undefined' )
    sessionStorage.setItem('__auth_token', _authToken = token)
}

function setDisplayName(name: string) {
  if ( typeof window !== 'undefined' )
    sessionStorage.setItem('__display_name', _displayName = name)
}

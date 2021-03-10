import axios, { AxiosError } from "axios"
import Router from "next/router"
import { getSessionToken } from "./users";


/**
 * Default handler for axios api requests.
 * 
 * @param error Error object
 */
export function axiosHandleError(error: AxiosError): any {
  if (error.response) {
    const { status, data } = error.response;

    if ( status === 401 )
      Router.push('/auth/signin')
    
    if ( data ) {
      if ( typeof data === 'object' && data.error )
        throw new Error(data.error)
      throw new Error(data)
    }
    else
      throw new Error(error.message)
  } 
  else
    throw new Error(error.message)
}

export function apiPost(url: string, data: any) {
  return axios.post(url, data).catch(axiosHandleError)
}

export function apiAuthorizedGet(url: string, params: any = {}) {
  const headers = getAuthorizedHeaders()
  return axios.get(url, { headers, params }).catch(axiosHandleError)
}

export function apiAuthorizedPost(url: string, data: any) {
  const headers = getAuthorizedHeaders()
  return axios.post(url, data, { headers }).catch(axiosHandleError)
}

export function apiAuthorizedPut(url: string, data: any) {
  const headers = getAuthorizedHeaders()
  return axios.put(url, data, { headers }).catch(axiosHandleError)
}

export function apiAuthorizedDelete(url: string) {
  const headers = getAuthorizedHeaders()
  return axios.delete(url, { headers }).catch(axiosHandleError)
}

function getAuthorizedHeaders() {
  const token = getSessionToken()
  
  if ( token ) 
    return { Authorization: token }
  
  return {}
}
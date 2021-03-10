import { NextApiRequest, NextApiResponse } from "next"
import { extractTokenData } from "./auth"

/**
 * Handles not allowed methods.
 * 
 * @param res Response object
 * @param allowed allowed methods
 */
export function handleMethodNotAllowed(res: NextApiResponse, allowed: string[]) {
  res.setHeader('Allow', allowed)
  res.status(405).end()
}

/**
 * Handles invalid submitted data from the client.
 * 
 * @param res Response object
 * @param field field name
 */
export function handleInvalidData(res: NextApiResponse, field: string) {
  res.status(400).json({ 
    error: `${field} is missing or doesn't meet the requirements.` 
  })
}

/**
 * Extract the authorization token from the request.
 * 
 * @param req Request object
 * @returns authorization token
 */
export function getAuthorizationToken(req: NextApiRequest) {
  return req.headers.authorization
}

/**
 * Handles invalid or missing authorization token.
 * 
 * @param res Response object
 */
export function handleNotAuthorized(res: NextApiResponse) {
  res.status(401).json({
    error: 'Authorization token in missing or invalid.'
  })
}

/**
 * Returns a promise that only resolves if the authorization
 * token is present in the request object and is valid.
 * 
 * @param req Request object
 * @returns a promise 
 */
export function authorize(req: NextApiRequest): Promise<any> {
  const token = getAuthorizationToken(req)

  if ( !token )
    return Promise.reject()

  const data = extractTokenData(token)

  if ( !data )
    return Promise.reject()

  return Promise.resolve(data)
}

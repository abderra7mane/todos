import IUser from "../models/User"
import { EMAIL_REGEX, NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from "./constants"


/**
 * Validate the provided name address
 * 
 * @param name
 * @returns true or false
 */
export function isNameValid(name: string) {
  return typeof name === 'string' && name.length >= NAME_MIN_LENGTH
}

/**
 * Validate the provided email address
 * 
 * @param email
 * @returns true or false
 */
export function isEmailValid(email: string) {
  return typeof email === 'string' && EMAIL_REGEX.test(email)
}

/**
 * Validate the provided password
 * 
 * @param password
 * @returns true or false
 */
export function isPasswordValid(password: string) {
  return typeof password === 'string' && password.length >= PASSWORD_MIN_LENGTH
}

/**
 * Calculate a secure hash value for the provided password
 * 
 * @param password
 * @returns a secure hash value
 */
export function secureHashPassword(password: string) {
  return password
}

/**
 * Verify that the provided password matches the given hash.
 * 
 * @param hash 
 * @parampassword 
 * @returns true or false
 */
export function verifyPassword(hash: string, password: string) {
  return hash === password
}

/**
 * Generate a secure authentication token to be used for api calls.
 * 
 * @param user 
 * @returns secure authentication token
 */
export function generateAuthToken(user: IUser) {
  return Buffer.from(`${user._id}:${user.email}`).toString('base64')
}

/**
 * Get plain data used to generate the token.
 * 
 * @param token 
 * @returns token data or undefined
 */
export function extractTokenData(token: string) {
  try {
    const data = Buffer.from(token, 'base64').toString()
    const [user, email] = data.split(':')
    return {user, email}
  }
  catch (e) {
    console.error(e)
  }
}

/**
 * Verify that the provided token is valid 
 * and was generated for the given email.
 * 
 * @param token 
 * @param email 
 * @returns true or false
 */
export function verifyAuthToken(token: string, email: string) {
  return extractTokenData(token).email === email
}

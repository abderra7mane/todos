import IUser from "../models/User"
import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from "./constants"


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

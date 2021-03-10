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

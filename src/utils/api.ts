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

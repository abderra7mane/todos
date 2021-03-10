import { NextApiRequest, NextApiResponse } from "next"
import { handleInvalidData, handleMethodNotAllowed } from "../../../utils/api"
import { generateAuthToken, isEmailValid, verifyPassword } from "../../../utils/auth"
import { findUser } from "../../../data/users"
import IUser from "../../../models/User"


const ALLOWED_METHODS = ['POST']


export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  // validate request method

  if ( !ALLOWED_METHODS.includes(method) ) {
    return handleMethodNotAllowed(res, ALLOWED_METHODS)
  }

  // validate parameters

  const { email, password } = body

  if ( !isEmailValid(email) ) {
    return handleInvalidData(res, 'email')
  }

  if ( !password ) {
    return handleInvalidData(res, 'password')
  }

  // authenticate user

  return authenticate({ email, password }).then((user) => {
    if ( ! user ) {
      return res.status(404).json({
        error: 'Invalid email or password!'
      })
    }

    // generate token

    const token = generateAuthToken(user)

    // response

    res.status(200).json({ token, email })
  })
}

function authenticate(user: { email: string, password: string }): Promise<IUser> {
  return new Promise(resolve => {
    findUser(user.email).then((dbUser) => {
      if ( ! dbUser )
        return resolve(null)
      
      if ( ! verifyPassword(dbUser.password, user.password) )
        return resolve(null)

      resolve(dbUser)
    })
  })
}

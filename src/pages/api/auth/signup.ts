import { createUser, findUser } from "../../../data/users"
import { handleInvalidData, handleMethodNotAllowed } from "../../../utils/api"
import { isEmailValid, isNameValid, isPasswordValid, secureHashPassword } from "../../../utils/auth"


const ALLOWED_METHODS = ['POST']


export default (req, res) => {
  const { method, body } = req

  // validate request method

  if ( !ALLOWED_METHODS.includes(method) ) {
    return handleMethodNotAllowed(res, ALLOWED_METHODS)
  }

  // validate parameters

  const { name, email, password } = body

  if ( !isNameValid(name) ) {
    return handleInvalidData(res, 'name')
  }

  if ( !isEmailValid(email) ) {
    return handleInvalidData(res, 'email')
  }

  if ( !isPasswordValid(password) ) {
    return handleInvalidData(res, 'password')
  }

  // check if user exists

  return findUser(email).then((user) => {
    if ( user ) {
      return res.status(400).json({ 
        error: `email address (${email}) already exists!` 
      })
    }
  
    // add user
  
    return createUser({ 
      name,
      email, 
      password: secureHashPassword(password)
    }).then((user) => {
      res.status(200).json({
        status: 'success',
        data: user
      })
    })
  })
}

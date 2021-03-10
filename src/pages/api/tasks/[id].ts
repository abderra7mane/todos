import { NextApiRequest, NextApiResponse } from "next"
import { deleteTask } from "../../../data/tasks"
import { authorize, handleMethodNotAllowed, handleNotAuthorized } from "../../../utils/api"


const ALLOWED_METHODS = ['DELETE']


export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  
  switch (method) {
    case 'DELETE':
      return handleDeleteTask(req, res)

    default:
      return handleMethodNotAllowed(res, ALLOWED_METHODS)
  }
}

function handleDeleteTask(req: NextApiRequest, res: NextApiResponse) {
  return authorize(req)
    .then(() => 
      deleteTask(req.query.id as string).then((deleted) => 
        res.status(200).json({
          status: 'success',
          data: deleted,
        })
      )
    )
    .catch(() => {
      handleNotAuthorized(res)
    })
}

import { NextApiRequest, NextApiResponse } from "next"
import { createTask, getUserTasks, updateTask } from "../../../data/tasks"
import { authorize, handleMethodNotAllowed, handleNotAuthorized } from "../../../utils/api"


const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']


export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  
  switch (method) {
    case 'GET':
      return handleGetTasks(req, res)

    case 'POST':
      return handleCreateTask(req, res)

    case 'PUT':
      return handleUpdateTask(req, res)

    default:
      return handleMethodNotAllowed(res, ALLOWED_METHODS)
  }
}

function handleGetTasks(req: NextApiRequest, res: NextApiResponse) {
  const { sort } = req.query
  let querySort = ''

  if ( typeof sort === 'string' ) {
    querySort = sort.split(',').join(' ')
  }

  return authorize(req)
    .then(({ user }) => 
      getUserTasks(user, querySort).then((tasks) => {
        res.status(200).json({
          status: 'success',
          data: tasks
        })
      })
    )
    .catch(() => {
      handleNotAuthorized(res)
    })
}

function handleCreateTask(req: NextApiRequest, res: NextApiResponse) {
  return authorize(req)
    .then(({ user }) => 
      createTask(user, req.body).then((id) => 
        res.status(200).json({
          status: 'success',
          data: id,
        })
      )
    )
    .catch(() => {
      handleNotAuthorized(res)
    })
}

function handleUpdateTask(req: NextApiRequest, res: NextApiResponse) {
  return authorize(req)
    .then(() => 
      updateTask(req.body).then((updated) => 
        res.status(200).json({
          status: 'success',
          data: updated,
        })
      )
    )
    .catch(() => {
      handleNotAuthorized(res)
    })
}


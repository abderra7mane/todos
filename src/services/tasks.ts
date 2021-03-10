import ITask, { TaskStatusEnum } from "../models/Task"
import { 
  apiAuthorizedDelete, apiAuthorizedGet, 
  apiAuthorizedPost, apiAuthorizedPut 
} from "./utils"


export function getTasks(): Promise<ITask[]> {
  return apiAuthorizedGet('/api/tasks')
    .then(({ data: { data }}) => data)
}

export function addTask(task: ITask): Promise<string> {
  return apiAuthorizedPost('/api/tasks', task)
    .then(({ data: { data }}) => data)
}

export function updateTask(task: ITask): Promise<boolean> {
  return apiAuthorizedPut('/api/tasks', task)
    .then(({ data: { data }}) => data)
}

export function updateTaskStatus(id: string, status: TaskStatusEnum): Promise<boolean> {
  return apiAuthorizedPut('/api/tasks', { _id: id, status })
    .then(({ data: { data }}) => data)
}

export function deleteTask(id: string): Promise<boolean> {
  return apiAuthorizedDelete(`/api/tasks/${id}`)
    .then(({ data: { data }}) => data)
}

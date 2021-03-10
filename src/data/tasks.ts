import TaskModel from "./schema/Task"
import ITask from "../models/Task"
import { createQuery, deleteQuery, getQuery, updateOneQuery } from "./utils"


export function getUserTasks(id: string): Promise<ITask[]> {
  return getQuery({ query: { user: id } }, TaskModel)
}

export function createTask(user: string, task: ITask): Promise<string> {
  return createQuery({ ...task, user, returnId: true }, TaskModel)
}

export function updateTask(task: ITask): Promise<string> {
  return updateOneQuery(task, TaskModel)
}

export function deleteTask(id: string): Promise<string> {
  return deleteQuery({ _id: id }, TaskModel)
}

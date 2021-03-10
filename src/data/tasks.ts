import TasksStore from "./store/Tasks"
import ITask from "../models/Task"
import { createQuery, deleteQuery, getQuery, updateOneQuery } from "./store/utils"


export function getUserTasks(id: string, sort: any = {}): Promise<ITask[]> {
  return getQuery({ query: { user: id }, sort }, TasksStore)
}

export function createTask(user: string, task: ITask): Promise<string> {
  return createQuery({ ...task, user, returnId: true }, TasksStore)
}

export function updateTask(task: ITask): Promise<string> {
  return updateOneQuery(task, TasksStore)
}

export function deleteTask(id: string): Promise<string> {
  return deleteQuery({ _id: id }, TasksStore)
}

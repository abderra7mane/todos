
export enum TaskStatusEnum {
  New = 1,
  Started = 2,
  Done = 3,
  Canceled = 4,
}

export enum TaskPriorityEnum {
  Normal = 1,
  Priority = 2,
  Critical = 3,
  Urgent = 4
}

export interface ITaskAttachment {
  name: string
  content: any
}

export default interface ITask {
  _id?: string
  user: string
  title: string
  description?: string
  due?: Date
  status: TaskStatusEnum
  priority: TaskPriorityEnum
  tags?: string[]
  attachments?: ITaskAttachment[]
}

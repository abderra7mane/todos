import UserModel from "./schema/User"
import IUser from "../models/User"
import { createQuery, getOneQuery } from "./utils"


export function createUser(user: IUser): Promise<string> {
  return createQuery({ ...user, returnId: true }, UserModel)
}

export function findUser(email: string): Promise<IUser> {
  return getOneQuery({ query: { email } }, UserModel)
}

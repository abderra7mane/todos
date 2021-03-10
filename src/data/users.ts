import UsersStore from "./store/Users"
import IUser from "../models/User"
import { createQuery, getOneQuery } from "./store/utils"


export function createUser(user: IUser): Promise<string> {
  return createQuery({ ...user, returnId: true }, UsersStore)
}

export function findUser(email: string): Promise<IUser> {
  return getOneQuery({ query: { email } }, UsersStore)
}

import { NotFoundError } from 'routing-controllers'
import { Instance } from 'sequelize'

import { User, UserORM } from 'models/user.model'
import { extractRawData } from 'utils/orm'

// TODO: move to auth0 service
export function getUsers(): PromiseLike<User[]> {
  return UserORM.findAll()
  .then((doorInstances) => doorInstances.map(extractRawData))
}

export function getUser(id: string): PromiseLike<User> {
  return UserORM.findOne({ where: { id }})
  .then(extractRawData)
}

export function addUser(user: User): PromiseLike<User> {
  return UserORM.create(user)
  .then(extractRawData)
}

export function updateUser(id: string, user: User): PromiseLike<User> {
  return UserORM.update(user, { where: { id: <string> user.id }})
  .then(([ count, users ]: [1, Instance<User>[]]): User => {
    let [ updatedUser ] = users
    if (!updatedUser) throw new NotFoundError(`instance with id ${id} was not found in db`)
    return extractRawData(updatedUser)
  })
}

export function deleteUser(id: string) {
  return UserORM.destroy({ where: { id }})
}

export function sync(): PromiseLike<{}> {
  return UserORM.sync()
}

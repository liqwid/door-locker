import { Instance } from 'sequelize'

import { Door, DoorORM } from 'models/door.model'
import { extractRawData } from 'utils/orm'
import { UserORM } from 'models/user.model'

export function getDoors(): PromiseLike<Door[]> {
  return DoorORM.findAll()
  .then((doorInstances: Instance<Door>[]) => doorInstances.map(extractRawData))
}

export async function getDoor(id: string): Promise<Door> {
  return DoorORM.findOne(
  { where: { id }, include: [
      { model: UserORM, as: 'users' }
    ]}
  )
  .then(extractRawData)
}

export function addDoor(door: Door): PromiseLike<Door> {
  return DoorORM.create(door)
  .then(extractRawData)
}

export async function updateDoor(id: string, door: Door): Promise<Door> {
  await DoorORM.update(door, { where: { id: <string> door.id }})
  const user = await DoorORM.findOne(
    { where: { id } }
  )
  if (door.users) {
    await user.setUsers(door.users.map(({ id: userId }) => userId))
  }

  return getDoor(id)
}

export function deleteDoor(id: string) {
  return DoorORM.destroy({ where: { id }})
}

export function sync(): PromiseLike<{}> {
  return DoorORM.sync()
}

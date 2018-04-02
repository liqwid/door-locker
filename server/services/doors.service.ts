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

export async function addDoor(doorData: Door): Promise<Door> {
  const door = await DoorORM.create(doorData)

  if (doorData.users) {
    await door.setUsers(doorData.users.map(({ id: userId }) => userId))
  }

  return extractRawData(door)
}

export async function updateDoor(id: string, doorData: Door): Promise<Door> {
  await DoorORM.update(doorData, { where: { id: <string> doorData.id }})
  const door = await DoorORM.findOne(
    { where: { id } }
  )
  if (doorData.users) {
    await door.setUsers(doorData.users.map(({ id: userId }) => userId))
  }

  return getDoor(id)
}

export function deleteDoor(id: string) {
  return DoorORM.destroy({ where: { id }})
}

export function sync(): PromiseLike<{}> {
  return DoorORM.sync()
}

import { NotFoundError } from 'routing-controllers'
import { Instance } from 'sequelize'

import { Door, DoorORM } from 'models/door.model'
import { extractRawData } from 'utils/orm'

export function getDoors(): PromiseLike<Door[]> {
  return DoorORM.findAll()
  .then((doorInstances) => doorInstances.map(extractRawData))
}

export function getDoor(id: string): PromiseLike<Door> {
  return DoorORM.findOne({ where: { id }})
  .then(extractRawData)
}

export function addDoor(door: Door): PromiseLike<Door> {
  return DoorORM.create(door)
  .then(extractRawData)
}

export function updateDoor(id: string, door: Door): PromiseLike<Door> {
  return DoorORM.update(door, { where: { id: <string> door.id }})
  .then(([ count, doors ]: [1, Instance<Door>[]]): Door => {
    let [ updatedDoor ] = doors
    if (!updatedDoor) throw new NotFoundError(`instance with id ${id} was not found in db`)
    return extractRawData(updatedDoor)
  })
}

export function deleteDoor(id: string) {
  return DoorORM.destroy({ where: { id }})
}

export function sync(): PromiseLike<{}> {
  return DoorORM.sync()
}

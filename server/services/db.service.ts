import * as Sequelize from 'sequelize'
import { DoorORM } from 'models/door.model'

export const sequelize = new Sequelize(<string> process.env.DATABASE_URL, {
  dialect: 'postgres'
})

export function syncWithDb(): Promise<{}[]> {
  return Promise.all([
    DoorORM.sync()
  ])
}

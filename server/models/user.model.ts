import { IsDefined } from 'class-validator'
import { STRING } from 'sequelize'
import { sequelize } from 'services/db.service'

export class User {
  @IsDefined()
  id: string
}

export const UserORM = sequelize.define('door', {
  id: {
    type: STRING,
    allowNull: false,
    primaryKey: true
  }
})

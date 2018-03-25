import { IsDefined, IsBoolean } from 'class-validator'
import { STRING, BOOLEAN } from 'sequelize'
import { sequelize } from 'services/sequelize'

export class User {
  @IsDefined()
  id: string

  @IsBoolean()
  isAdmin?: boolean
}

export const UserORM = sequelize.define('user', {
  id: {
    type: STRING,
    allowNull: false,
    primaryKey: true
  },

  isAdmin: {
    type: BOOLEAN,
    defaultValue: false
  }
})

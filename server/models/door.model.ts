import { IsDefined } from 'class-validator'
import { STRING, UUID, UUIDV4 } from 'sequelize'
import { sequelize } from 'services/sequelize'
import { User } from 'models/user.model'

export class Door {
  id?: string
  
  @IsDefined()
  name: string

  users?: User[]
}

export const DoorORM: any = sequelize.define('door', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  }
})

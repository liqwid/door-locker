import { IsDefined } from 'class-validator'
import { STRING, UUID, UUIDV4 } from 'sequelize'
import { sequelize } from 'services/sequelize'

export class Door {
  id?: string
  
  @IsDefined()
  name: string
}

export const DoorORM = sequelize.define('door', {
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

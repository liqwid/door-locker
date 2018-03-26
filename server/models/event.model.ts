import { IsNumber, IsUUID, IsString, IsDefined } from 'class-validator'
import { DATE, UUID, UUIDV4 } from 'sequelize'
import { sequelize } from 'services/sequelize'

export class Event {
  @IsUUID()
  id?: string
  
  @IsNumber()
  date: number

  @IsString()
  type: string

  @IsDefined()
  userId: string

  @IsUUID()
  doorId: string
}

export const EventORM = sequelize.define('event', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  
  date: {
    type: DATE,
    allowNull: false
  }
})

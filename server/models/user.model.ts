import { IsDefined, IsBoolean, IsEmail, MinLength, IsArray } from 'class-validator'
import { STRING, BOOLEAN } from 'sequelize'
import { sequelize } from 'services/sequelize'
import { Identity, AppMetadata, UserMetadata } from 'auth0'
import { Door } from 'models/door.model'
import { MinLengthOrEmpty } from 'utils/validators'

export class User {
  @IsDefined()
  id: string

  @IsBoolean()
  isAdmin: boolean

  @IsArray()
  doors?: Door[]

  // Auth0 params
  @IsEmail()
  email?: string

  @MinLength(5)
  username?: string

  @MinLengthOrEmpty(8)
  password?: string
  
  email_verified?: boolean
  phone_number?: string
  phone_verified?: boolean
  user_id?: string
  created_at?: string
  updated_at?: string
  identities?: Identity[]
  app_metadata?: AppMetadata
  user_metadata?: UserMetadata
  picture?: string
  name?: string
  nickname?: string
  multifactor?: string[]
  last_ip?: string
  last_login?: string
  logins_count?: number
  blocked?: boolean
  given_name?: string
  family_name?: string
}

export class NewUser {
  @IsEmail()
  email: string

  @MinLengthOrEmpty(8)
  password?: string

  @MinLength(4)
  username: string

  @IsBoolean()
  isAdmin: boolean

  @IsArray()
  doors: Door[]
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

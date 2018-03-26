import { IsDefined, IsBoolean, IsEmail, MinLength } from 'class-validator'
import { STRING, BOOLEAN } from 'sequelize'
import { sequelize } from 'services/sequelize'
import { Identity, AppMetadata, UserMetadata } from 'auth0'

export class User {
  @IsDefined()
  id: string

  @IsBoolean()
  isAdmin: boolean
  
  email?: string
  email_verified?: boolean
  username?: string
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
  password?: string
}

export class UserData {
  @IsEmail()
  email: string

  @MinLength(8)
  password: string

  @MinLength(4)
  username: string

  @IsBoolean()
  isAdmin: boolean
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

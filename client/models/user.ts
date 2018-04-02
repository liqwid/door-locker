import { Door } from 'models/door'

export interface User {
  username: string
  email: string
  id: string
  isAdmin?: boolean
  password?: string
  doors?: Door[]
}

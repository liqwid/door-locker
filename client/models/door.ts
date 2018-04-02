import { User } from 'models/user'
export interface Door {
  name: string
  id: string
  opened?: boolean
  accessDenied?: boolean
  users?: User[]
}

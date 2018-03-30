import { User } from 'models/user'
export interface Door {
  name: string
  id: string
  opened?: boolean
  accessDenied?: boolean
  users?: User[]
}

export interface DoorData {
  name: string
  users: { id: string }[]
}

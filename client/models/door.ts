export interface Door {
  name: string
  id: string
  opened?: boolean
  accessDenied?: boolean
}

export interface DoorData {
  name: string
  users: string[]
}

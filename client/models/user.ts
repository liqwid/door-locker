export interface User {
  username: string
  email: string
  id: string
  isAdmin?: boolean
}

export interface UserData {
  username: string
  email: string
  password: string
  doors: string[]
}

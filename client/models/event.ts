import { Door } from 'models/door'

export interface Event {
  id: string
  date: string
  type: string
  username: string
  door: Door
}

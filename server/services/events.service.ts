import { Event, EventORM } from 'models/event.model'
import { extractRawData } from 'utils/orm'
import { DoorORM } from 'models/door.model'
import { managementClient } from 'services/auth.service'

const NOT_FOUND_USER_NAME = 'Deleted user'
const DOOR_OPEN_EVENT_TYPE = 'opened'
// const DOOR_ACCESS_DENIED_EVENT_TYPE = 'tried to access'

export function getEvents(): Promise<Event[]> {
  return Promise.all([
    EventORM.findAll({ include: [
      { model: DoorORM, as: 'door' }
    ]}),
    managementClient.getUsers()
  ])
  .then(([eventInstances, users]) =>
    eventInstances
    .map(extractRawData)
    .map((event: Event): Event => {
      const eventUser = users.find((user) => user.user_id === event.userId)
      event.username = eventUser ? eventUser.username : NOT_FOUND_USER_NAME

      return event
    })
  )
}

export function logEvent(doorId: string, userId: string): PromiseLike<Event> {
  return EventORM.create({
    type: DOOR_OPEN_EVENT_TYPE,
    date: Date.now(),
    doorId,
    userId,
  })
}

export function sync(): PromiseLike<{}> {
  return EventORM.sync()
}

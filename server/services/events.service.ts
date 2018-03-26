import { Event, EventORM } from 'models/event.model'
import { extractRawData } from 'utils/orm'

export function getEvents(): PromiseLike<Event[]> {
  return EventORM.findAll()
  .then((eventInstances) => eventInstances.map(extractRawData))
}

export function logEvent(doorId: string, userId: string): PromiseLike<Event> {
  return EventORM.create({
    type: 'door opened',
    date: Date.now(),
    doorId,
    userId,
  })
}

export function sync(): PromiseLike<{}> {
  return EventORM.sync()
}

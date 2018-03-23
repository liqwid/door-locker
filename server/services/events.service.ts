import { Event, EventORM } from 'models/event.model'

function getDoorOpenEvent(doorId: string, userId: string): Event {
  return {
    type: 'door opened',
    date: Date.now(),
    doorId,
    userId,
  }
}

export function logEvent(doorId: string, userId: string): PromiseLike<Event> {
  return EventORM.create(getDoorOpenEvent(doorId, userId))
}

export function sync(): PromiseLike<{}> {
  return EventORM.sync()
}

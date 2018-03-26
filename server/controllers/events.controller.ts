import { JsonController, Get, Authorized } from 'routing-controllers'
import { getEvents } from 'services/events.service'
import { MANAGE_DOORS } from 'models/scopes.model'
import { Event } from 'models/event.model'

@JsonController('/events')
export class EventsController {
  @Authorized(MANAGE_DOORS)
  @Get()
  get(): PromiseLike<Event[]> {
    return getEvents()
  }
}

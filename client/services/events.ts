import { Injectable } from 'react.di'

import { CollectionService } from 'services/collection' 
import { Event } from 'models/event'

@Injectable
export class EventService extends CollectionService<Event> {
  endPoint = '/events'
}

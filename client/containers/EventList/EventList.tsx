import * as React from 'react'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import { SUCCESS, ERROR, LOADING, FetchMessage } from 'services/collection'
import { EventService } from 'services/events'
import { Door } from 'models/door'
import { Event } from 'models/event'
import { List } from 'components/List'

export const ERROR_TEXT: string = 'Failed to load events. Try again'

export interface EventListProps {}

export interface EventListState {
  events: Event[]
  loading: boolean
  error: boolean
}

function formatDate(date: Date): string {
  return ('00' + (date.getMonth() + 1)).slice(-2) + '/' + 
  ('00' + date.getDate()).slice(-2) + '/' + 
  date.getFullYear() + ' ' + 
  ('00' + date.getHours()).slice(-2) + ':' + 
  ('00' + date.getMinutes()).slice(-2) + ':' + 
  ('00' + date.getSeconds()).slice(-2)
}

function getEventMessage(username: string, date: string, type: string, door: Door) {
  return `${formatDate(new Date(date))}: ${username} ${type} ${door.name}`
}

export class EventList extends React.Component<EventListProps, EventListState> {
  @Inject eventService: EventService

  unsubscribe$: Subject<void>
  state = {
    events: [],
    loading: true,
    error: false
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.connectEventService()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  connectEventService() {
    this.eventService.getDataStream()
    // Auto unsubscribe when this.unsubscribe$.next is called
    .takeUntil(this.unsubscribe$)
    .subscribe(({ status, items }: FetchMessage<Event>) => {
      if (status === LOADING) {
        this.setState({ loading: true, error: false, events: [] })
        return
      }
      if (status === ERROR) {
        this.setState({ loading: false, error: true, events: [] })
        return
      }
      if (status === SUCCESS) {
        this.setState({ loading: false, error: false, events: items })
        return
      }
    })

    this.eventService.fetchItems()
  }

  render() {
    const { events, loading, error } = this.state

    return (
      <List
        loading={loading}
        error={error}
        onRefresh={this.eventService.fetchItems}
        errorText={ERROR_TEXT}
        items={events.map(({ username, id, door, type, date }: Event) => 
          ({ id, text: getEventMessage(username, date, type, door) })
        )}
      />
    )
  }
}

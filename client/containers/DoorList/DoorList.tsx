import * as React from 'react'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'

import { SUCCESS, ERROR, LOADING, FetchMessage } from 'services/collection'
import { DoorService } from 'services/doors'
import { Door } from 'models/door'
import { Loader } from 'components/Loader'
import { Link } from 'components/Link'

export const ERROR_TEXT: string = 'Failed to load doors. Try again'

export interface DoorListProps {
  style?: {}
}

export interface DoorListState {
  doors: Door[]
  loading: boolean
  error: boolean
}

export class DoorList extends React.Component<DoorListProps, DoorListState> {
  @Inject doorService: DoorService

  unsubscribe$: Subject<void>
  state = {
    doors: [],
    loading: true,
    error: false
  }

  constructor(props: DoorListProps) {
    super(props)
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.connectDoorService()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  connectDoorService() {
    this.doorService.getDataStream()
    // Auto unsubscribe when this.unsubscribe$.next is called
    .takeUntil(this.unsubscribe$)
    .subscribe(({ status, items }: FetchMessage<Door>) => {
      if (status === LOADING) {
        this.setState({ loading: true, error: false, doors: [] })
        return
      }
      if (status === ERROR) {
        this.setState({ loading: false, error: true, doors: [] })
        return
      }
      if (status === SUCCESS) {
        this.setState({ loading: false, error: false, doors: items })
        return
      }
    })

    this.doorService.fetchItems()
  }

  render() {
    const { doors, loading, error } = this.state

    return (
      <List component='nav'>
        {
          error && <ListItem button={true} onClick={this.doorService.fetchItems}>
            <ListItemText primary={ERROR_TEXT} />
            <Divider />
          </ListItem>
        }
        {
          loading && <Loader />
        }
        {
          doors.length > 0 && doors.map(({ name, id }: Door) =>
            <Link to={`/doors/${id}/show`} key={id}>
              <ListItem button={true}>
                <ListItemText primary={name} />
                <Divider />
              </ListItem>
            </Link>
          )
        }
      </List>
    )
  }
}

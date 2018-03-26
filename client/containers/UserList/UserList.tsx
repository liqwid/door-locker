import * as React from 'react'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'

import { SUCCESS, ERROR, LOADING, FetchMessage } from 'services/collection'
import { UserService } from 'services/users'
import { User } from 'models/user'
import { Loader } from 'components/Loader'

export const ERROR_TEXT: string = 'Failed to load users. Try again'

export interface UserListProps {
  style?: {}
}

export interface UserListState {
  users: User[]
  loading: boolean
  error: boolean
}

export class UserList extends React.Component<UserListProps, UserListState> {
  @Inject userService: UserService

  unsubscribe$: Subject<void>
  state = {
    users: [],
    loading: true,
    error: false
  }

  constructor(props: UserListProps) {
    super(props)
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.connectUserService()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  connectUserService() {
    this.userService.getDataStream()
    // Auto unsubscribe when this.unsubscribe$.next is called
    .takeUntil(this.unsubscribe$)
    .subscribe(({ status, items }: FetchMessage<User>) => {
      if (status === LOADING) {
        this.setState({ loading: true, error: false, users: [] })
        return
      }
      if (status === ERROR) {
        this.setState({ loading: false, error: true, users: [] })
        return
      }
      if (status === SUCCESS) {
        this.setState({ loading: false, error: false, users: items })
        return
      }
    })

    this.userService.fetchItems()
  }

  render() {
    const { users, loading, error } = this.state

    return (
      <List component='nav'>
        {
          error && <ListItem button={true} onClick={this.userService.fetchItems}>
            <ListItemText primary={ERROR_TEXT} />
            <Divider />
          </ListItem>
        }
        {
          loading && <Loader />
        }
        {
          users.length > 0 && users.map(({ username, id }: User) =>
            <ListItem key={id} button={true}>
              <ListItemText primary={username} />
              <Divider />
            </ListItem>
          )
        }
      </List>
    )
  }
}

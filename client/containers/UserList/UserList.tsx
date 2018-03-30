import * as React from 'react'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import { SUCCESS, ERROR, LOADING, FetchMessage } from 'services/collection'
import { UserService } from 'services/users'
import { User } from 'models/user'
import { List } from 'components/List'

export const ERROR_TEXT: string = 'Failed to load users. Try again'
export const ADD_TEXT: string = 'Add User'

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
      <List
        loading={loading}
        error={error}
        onRefresh={this.userService.fetchItems}
        errorText={ERROR_TEXT}
        addLink='/users/add'
        addText={ADD_TEXT}
        items={users.map(({ id, username }: User) => 
          ({ id, text: username, link: `/users/${id}/edit` })
        )}
      />
    )
  }
}

import * as React from 'react'

import { AjaxError } from 'rxjs/observable/dom/AjaxObservable'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'

import { RouteComponentProps } from 'react-router'

import { DoorService } from 'services/doors'
import { UserService } from 'services/users'
import { Door } from 'models/door'
import { User } from 'models/user'
import { Loader } from 'components/Loader'
import { PrimaryButton, SecondaryButton } from 'components/Button'
import { MultiSelect } from 'components/MultiSelect'
import { CenteredContent } from 'components/CenteredContent'
import { FormContent, FormFields, RefreshButton } from 'components/Form'

export const ERROR_TEXT: string = 'Failed to load door data'
export const REFRESH_TEXT: string = 'Try again'
export const OPEN_TEXT: string = 'Open'
export const EDIT_TEXT: string = 'Edit Door'
export const ACCESS_DENIED_TEXT: string = 'Access denied'
export const OPENED_TEXT: string = 'Door opened'
export const NAME_LABEL = 'Name'
export const USERS_LABEL = 'Users with access'
export const DELETE_TEXT = 'Delete door'
export const SAVE_TEXT = 'Save door'

export type DoorValidationErrors = {
  [ key in keyof Door ]?: string
}

export interface DoorFormProps extends RouteComponentProps<{ id: string }> {}

export interface DoorFormState extends Door {
  loading: boolean
  error: boolean
  id: string
  validationErrors: DoorValidationErrors
  name: string
  users: User[]
  allUsers: User[]
}

const INITIAL_DATA = {
  id: '',
  name: '',
  users: [],
  allUsers: []
}

export class DoorForm extends React.Component<DoorFormProps, DoorFormState> {
  @Inject doorService: DoorService
  @Inject userService: UserService

  unsubscribe$: Subject<void>
  state: DoorFormState = {
    error: false,
    loading: true,
    validationErrors: {},
    ...INITIAL_DATA
  }

  constructor(props: DoorFormProps) {
    super(props)
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.fetchData()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  fetchDoor() {
    const { id } = this.props.match.params
    if (id) {
      return this.doorService.fetchItem(id)
    }
    return Observable.of({
      name: '',
      users: []
    })
  }

  fetchData = () => {
    this.setState({ loading: true, error: false, ...INITIAL_DATA })

    Observable.combineLatest(
      this.userService.fetchItems(),
      this.fetchDoor()
    )
    .takeUntil(this.unsubscribe$)
    .catch((err: AjaxError) => {
      this.setState({ loading: false, error: true, ...INITIAL_DATA })
      return Observable.of(err)
    })
    .subscribe(([ allUsers, door ]: [ User[], Door & { users: User[] } ]) => {
      this.setState({ loading: false, error: false, ...door, allUsers })
    })
  }
  
  formatUserValue = ({ username, id }: User) => ({ text: username, id })

  updateUsers = ({ target: { value: userIds }}: React.ChangeEvent<any>) => {
    const users = userIds.map((id) => ({ id }))
    this.setState({ users })
  }

  saveDoor = () => {
    const { id, name, users } = this.state
    const { doorService } = this
    const saveRequest = id
      ? doorService.updateItem(id, { id, name, users })
      : doorService.addItem({ name, users })

    saveRequest.takeUntil(this.unsubscribe$)
    .subscribe(
      ({ id: doorId }) => this.props.history.push(`/doors/${doorId}/show`),
      (validationErrors: DoorValidationErrors) => {
        this.setState({ validationErrors })
        return Observable.throw(null)
      }
    )
  }

  deleteDoor = () => {
    const { id } = this.state
    this.doorService.deleteItem(id)
    .takeUntil(this.unsubscribe$)
    .subscribe(() => this.props.history.push(`/doors`))
  }

  render() {
    const { loading, error, id, name, users, allUsers, validationErrors } = this.state

    if (loading) return <Loader />

    if (error) {
      return (
        <CenteredContent>
          { 
            error &&
            <Typography gutterBottom={true} align='center' variant='display1'>
              {ERROR_TEXT}
            </Typography>
          }
          {
            error && id &&
            <RefreshButton onClick={this.fetchData}>
              {REFRESH_TEXT}
            </RefreshButton>
          }
        </CenteredContent>
      )
    }

    return (
      <FormContent>
        <FormFields>
          <TextField
            id='name'
            label={NAME_LABEL}
            value={name}
            error={Boolean(validationErrors.name)}
            helperText={validationErrors.name}
            onChange={({ target: { value }}) => this.setState({ name: value })}
            margin='normal'
          />
          <MultiSelect
            values={allUsers.map(this.formatUserValue)}
            selectedValues={users.map(this.formatUserValue)}
            onChange={this.updateUsers}
            label={USERS_LABEL}
          />
        </FormFields>
        { id && <SecondaryButton onClick={this.deleteDoor}>
          {DELETE_TEXT}
        </SecondaryButton>}
        <PrimaryButton onClick={this.saveDoor}>
          {SAVE_TEXT}
        </PrimaryButton>
      </FormContent>
    )
  }
}

import * as React from 'react'

import { AjaxError } from 'rxjs/observable/dom/AjaxObservable'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/withLatestFrom'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Switch from 'material-ui/Switch'
import { FormControlLabel } from 'material-ui/Form'

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

export const ERROR_TEXT: string = 'Failed to load user data'
export const REFRESH_TEXT: string = 'Try again'
export const OPEN_TEXT: string = 'Open'
export const EDIT_TEXT: string = 'Edit User'
export const ACCESS_DENIED_TEXT: string = 'Access denied'
export const USERNAME_LABEL = 'User Name'
export const EMAIL_LABEL = 'Email'
export const PASSWORD_LABEL = 'New Password'
export const USERS_LABEL = 'Access to doors'
export const ADMIN_LABEL = 'Admin rights'
export const DELETE_TEXT = 'Delete user'
export const SAVE_TEXT = 'Save user'

export interface UserFormProps extends RouteComponentProps<{ id: string }> {}

export interface UserFormState extends User {
  loading: boolean
  error: boolean
  id: string
  isAdmin: boolean
  doors: Door[]
  allDoors: Door[]
}

const INITIAL_DATA = {
  id: '',
  username: '',
  isAdmin: false,
  email: '',
  password: '',
  doors: [],
  allDoors: []
}

export class UserForm extends React.Component<UserFormProps, UserFormState> {
  @Inject userService: UserService
  @Inject doorService: DoorService

  unsubscribe$: Subject<void>
  state = {
    error: false,
    loading: true,
    ...INITIAL_DATA
  }

  constructor(props: UserFormProps) {
    super(props)
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.fetchData()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }

  fetchUser() {
    const { id } = this.props.match.params
    if (id) {
      return this.userService.fetchItem(id)
    }
    return Observable.of(INITIAL_DATA)
  }

  fetchData = () => {
    this.setState({ loading: true, error: false, ...INITIAL_DATA })

    this.fetchUser().withLatestFrom(this.doorService.fetchItems())
    .takeUntil(this.unsubscribe$)
    .catch((err: AjaxError) => {
      this.setState({ loading: false, error: true, ...INITIAL_DATA })
      return Observable.of(err)
    })
    .subscribe(([ user, allDoors ]: [ User & { doors: Door[], isAdmin: boolean }, Door[] ]) => {
      this.setState({ loading: false, error: false, ...user, allDoors })
    })
  }
  
  formatDoorValue = ({ name, id }: Door) => ({ text: name, id })

  updateDoors = ({ target: { value: doorIds }}: React.ChangeEvent<any>) => {
    const doors = doorIds.map((id) => ({ id }))
    this.setState({ doors })
  }

  saveUser = () => {
    const { id, username, doors, email, password, isAdmin } = this.state
    const { userService } = this
    const saveRequest = id
      ? userService.updateItem(id, { id, username, doors, email, password, isAdmin })
      : userService.addItem({ username, doors, email, password, isAdmin })

    saveRequest.takeUntil(this.unsubscribe$)
    .subscribe(({ id: userId }) => this.props.history.push(`/users`))
  }

  deleteUser = () => {
    const { id } = this.state
    this.userService.deleteItem(id)
    .takeUntil(this.unsubscribe$)
    .subscribe(() => this.props.history.push(`/users`))
  }

  render() {
    const { loading, error, id, username, email, password, doors, allDoors, isAdmin } = this.state

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
            label={USERNAME_LABEL}
            value={username}
            onChange={({ target: { value }}) => this.setState({ username: value })}
            margin='normal'
          />
          <TextField
            label={EMAIL_LABEL}
            value={email}
            onChange={({ target: { value }}) => this.setState({ email: value })}
            margin='normal'
          />
          <TextField
            label={PASSWORD_LABEL}
            type='password'
            value={password}
            onChange={({ target: { value }}) => this.setState({ password: value })}
            margin='normal'
          />
          <MultiSelect
            values={allDoors.map(this.formatDoorValue)}
            selectedValues={doors.map(this.formatDoorValue)}
            onChange={this.updateDoors}
            label={USERS_LABEL}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isAdmin}
                onChange={({ target: { checked }}) => this.setState({ isAdmin: checked })}
                value='isAdmin'
                color='primary'
              />
            }
            label={ADMIN_LABEL}
          />
        </FormFields>
        <SecondaryButton onClick={this.deleteUser}>
          {DELETE_TEXT}
        </SecondaryButton>
        <PrimaryButton onClick={this.saveUser}>
          {SAVE_TEXT}
        </PrimaryButton>
      </FormContent>
    )
  }
}

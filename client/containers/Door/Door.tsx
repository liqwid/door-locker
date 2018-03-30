import * as React from 'react'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { Inject } from 'react.di'

import Typography from 'material-ui/Typography'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'

import styled from 'styled-components'

import { SUCCESS, ERROR, LOADING, FetchMessage } from 'services/collection'
import { DoorService } from 'services/doors'
import { Door } from 'models/door'
import { Loader } from 'components/Loader'
import { Link } from 'components/Link'
import { CenteredContent } from 'components/CenteredContent'
import { DefaultButton, PrimaryButton } from 'components/Button'

export const ERROR_TEXT: string = 'Failed to load door data'
export const REFRESH_TEXT: string = 'Try again'
export const OPEN_TEXT: string = 'Open'
export const EDIT_TEXT: string = 'Edit Door'
export const ACCESS_DENIED_TEXT: string = 'Access denied'
export const OPENED_TEXT: string = 'Door opened'

export interface DoorPageProps {
  match: {
    params: {
      id: string
    }
  }
}

export interface DoorPageState {
  name: string
  opened: boolean
  accessDenied: boolean
  loading: boolean
  error: boolean
}

const EditLink = styled(Link)`
  max-width: 80%;
`

const OpenButton = styled(DefaultButton)`
  max-width: 80% !important;
`

const BackIcon = styled(KeyboardArrowLeft)`
  position: absolute;
  top: 16px;
  left: 12px;
  color: white;
  font-size: 36px !important;
`

export class DoorPage extends React.Component<DoorPageProps, DoorPageState> {
  @Inject doorService: DoorService

  unsubscribe$: Subject<void>
  state = {
    name: '',
    opened: false,
    accessDenied: false,
    loading: true,
    error: false
  }

  constructor(props: DoorPageProps) {
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
      const { id } = this.props.match.params
      const currentDoor = items.find((door) => door.id === id)
      
      if (status === LOADING) {
        this.setState({ loading: true, error: false, name: '' })
        return
      }
      if (status === ERROR || !currentDoor) {
        this.setState({ loading: false, error: true, name: '' })
        return
      }
      if (status === SUCCESS && currentDoor) {
        const { name, opened, accessDenied } = currentDoor
        this.setState({
          loading: false,
          error: false,
          name,
          opened: opened || false,
          accessDenied: accessDenied || false
        })
        return
      }
    })

    if (!this.doorService.fetchedOnce) this.doorService.fetchItems()
  }

  openDoor = () => {
    const { id } = this.props.match.params
    this.doorService.openDoor(id)
  }

  render() {
    const { name, loading, error, accessDenied, opened } = this.state
    const { id } = this.props.match.params

    return (
      <CenteredContent>
        {loading && <Loader />}
        <Typography gutterBottom={true} align='center' variant='display1'>
          {error && ERROR_TEXT}
          {name}
        </Typography>
        {
          accessDenied && 
          <Typography color='secondary' align='center' variant='display2'>
            {ACCESS_DENIED_TEXT}
          </Typography>
        }
        {
          opened && 
          <Typography color='primary' align='center' variant='display2'>
            {OPENED_TEXT}
          </Typography>
        }
        { !accessDenied && !opened &&
          <OpenButton onClick={error ? this.doorService.fetchItems : this.openDoor}>
            {name  && OPEN_TEXT}
            {error && REFRESH_TEXT}
          </OpenButton>
        }
        {
          name && <EditLink to={`/doors/${id}/edit`}>
            <PrimaryButton>
              {EDIT_TEXT}
            </PrimaryButton>
          </EditLink>
        }
        <Link to='/doors'>
          <BackIcon />
        </Link>
      </CenteredContent>
    )
  }
}

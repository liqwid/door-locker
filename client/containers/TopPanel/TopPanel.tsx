import * as React from 'react'

import { Inject } from 'react.di'

import styled from 'styled-components'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/takeUntil'

import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import { AuthService } from 'services/auth'

interface TopPanelProps {}
interface TopPanelState {
  nickname: string
  picture: string
}

const UserPic = styled(Avatar)`
  height: 64px !important;
  width: 64px !important;
  margin: 8px 8px 8px 0 !important;
`

export class TopPanel extends React.Component<TopPanelProps, TopPanelState> {
  @Inject auth: AuthService
  unsubscribe$: Subject<void>

  state = {
    nickname: '',
    picture: ''
  }

  componentDidMount() {
    this.unsubscribe$ = new Subject()
    this.connectAuthService()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }
  
  connectAuthService() {
    this.auth.getCurrentUserDataStream()
    .filter(Boolean)
    .subscribe(({ nickname, picture }) => this.setState({ nickname, picture }))
  }

  render() {
    const { nickname, picture } = this.state

    return (
      <Paper elevation={1}>
        <Toolbar>
          <UserPic
            alt={nickname}
            src={picture}
          />
        <Typography align='left' variant='display1'>
          {nickname}
        </Typography>
        </Toolbar>
      </Paper>
    )
  }
}

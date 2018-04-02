import * as React from 'react'
import { Module, Inject } from 'react.di'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import CssBaseline from 'material-ui/CssBaseline'
import { Router, Route, Switch, Redirect } from 'react-router'
const Media = require('react-media').default
import styled from 'styled-components'

import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import { DARK_BLUE_GRAY, TEAL, RED_ORANGE } from 'styles/colors'
import { TABLET_VERTICAL } from 'styles/media'

import { RestClient } from 'services/restApi'
import { DoorService } from 'services/doors'
import { UserService } from 'services/users'
import { history } from 'services/history'
import { AuthService, AUTH_STATUS, LOADING, AUTHENTICATED } from 'services/auth'

import { Sidebar } from 'containers/Sidebar'
import { Loader } from 'components/Loader'
import { EventService } from 'services/events'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Play, Roboto'
  },
  palette: {
    type: 'dark',
    background: {
      default: DARK_BLUE_GRAY,
      paper: DARK_BLUE_GRAY,
    },
    primary: {
      main: TEAL
    },
    secondary: {
      main: RED_ORANGE
    },
    error: {
      main: RED_ORANGE
    }
  }
})

interface AppProps {}
interface AppState {
  authStatus: AUTH_STATUS
  isAdmin: boolean
}

const Layout = styled.div`
  height: 100vh;
`

@Module({
  providers: [
    RestClient,
    DoorService,
    UserService,
    AuthService,
    EventService,
  ]
})
class App extends React.Component<AppProps, AppState> {
  @Inject auth: AuthService
  unsubscribe$: Subject<void> = new Subject()

  state = {
    authStatus: LOADING,
    isAdmin: false
  }

  componentDidMount() {    
    this.auth.getAuthStatusStream()
    .takeUntil(this.unsubscribe$)
    .subscribe((authStatus) => this.setState({ authStatus }))

    this.auth.getCurrentUserDataStream()
    .takeUntil(this.unsubscribe$)
    .filter(Boolean)
    .subscribe(({ isAdmin }) => this.setState({ isAdmin }))

    this.auth.initialize()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }
  
  render() {
    const { authStatus, isAdmin } = this.state
    
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        { authStatus === LOADING && <Loader/> }
        { authStatus === AUTHENTICATED && <Router history={history}>
          <Switch>
            <Route
              path='/'
              render={(props) => (
                <Media query={`(max-width: ${TABLET_VERTICAL}px)`}>
                  {(matches: boolean) => (
                    <Layout>
                      {/**
                        *  Side-menu for desktop/Only screen for mobile
                        */
                        <Sidebar isAdmin={isAdmin} isTablet={matches} />
                      }
                    </Layout>
                  )}
                </Media>
              )}
            />
            <Redirect to='/doors' />
          </Switch>
        </Router> }
      </MuiThemeProvider>
    )
  }
}

export default App

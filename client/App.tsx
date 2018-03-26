import * as React from 'react'
import { Module, Inject } from 'react.di'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import CssBaseline from 'material-ui/CssBaseline'
import { Router, Route, Switch, Redirect } from 'react-router'
const Media = require('react-media').default
import styled from 'styled-components'

import { Subject } from 'rxjs/Subject'

import { DARK_BLUE_GRAY, TEAL, RED_ORANGE } from 'styles/colors'
import { TABLET_VERTICAL } from 'styles/media'

import { RestClient } from 'services/restApi'
import { DoorService } from 'services/doors'
import { UserService } from 'services/users'
import { history } from 'services/history'
import { AuthService, AUTH_STATUS, LOADING, AUTHENTICATED } from 'services/auth'

import { Main } from 'containers/Main'
import { Sidebar } from 'containers/Sidebar'
import { Loader } from 'components/Loader'

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
  ]
})
class App extends React.Component<AppProps, AppState> {
  @Inject auth: AuthService
  unsubscribe$: Subject<void> = new Subject()

  state = {
    authStatus: LOADING
  }

  componentDidMount() {    
    this.auth.getAuthStatusStream()
    .takeUntil(this.unsubscribe$)
    .subscribe((authStatus) => this.setState({ authStatus }))

    this.auth.initialize()
  }

  componentWillUnmount() {
    this.unsubscribe$.next()
  }
  
  render() {
    const { authStatus } = this.state
    
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
                        <Sidebar isAdmin={true} isTablet={matches} />
                      }
                      {/**
                        *  Main screen for desktop
                        */
                        !matches &&  <Main isAdmin={true} />
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

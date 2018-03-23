import * as React from 'react'
import { Module } from 'react.di'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import CssBaseline from 'material-ui/CssBaseline'

import { DARK_BLUE_GRAY, TEAL, RED_ORANGE } from 'styles/colors'

import { RestClient } from 'services/restApi'
import { DoorService } from 'services/doors'
import { UserService } from 'services/users'

import { DoorList } from 'containers/DoorList'
import { BottomNav } from 'components/BottomNav'
import { Menu } from 'components/Menu'

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

@Module({
  providers: [
    RestClient,
    DoorService,
    UserService,
  ]
})
class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Menu>
          <DoorList />
          <BottomNav />
        </Menu>
      </MuiThemeProvider>
    )
  }
}

export default App

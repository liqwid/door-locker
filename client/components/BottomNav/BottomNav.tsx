import * as React from 'react'

import { withRouter, RouteComponentProps } from 'react-router-dom'

import { Inject } from 'react.di'

import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation'
import Lock from 'material-ui-icons/Lock'
import People from 'material-ui-icons/People'
import ExitToApp from 'material-ui-icons/ExitToApp'
import AssignmentLate from 'material-ui-icons/AssignmentLate'

import { AuthService } from 'services/auth'

interface BottomNavProps {
  isAdmin: boolean
}
interface BottomNavState {}

export class BottomNavComponent extends React.Component<BottomNavProps & RouteComponentProps<{}>, BottomNavState> {
  @Inject auth: AuthService
  
  handleChange = (event: React.ChangeEvent<{}>, selected: string) => {
    if (selected === 'logout') return this.auth.logout()
    this.props.history.push(`/${selected}`)
  }

  render() {
    const { isAdmin, location } = this.props
    const selected = location.pathname.replace(/\/([^\/]+)(\/|$)/, ($0, $1) => $1)

    return (
      <BottomNavigation value={selected} onChange={this.handleChange}>
        { isAdmin &&
          <BottomNavigationAction style={{ minWidth: 0 }} label='Users' value='users' icon={<People />}/>
        }
        <BottomNavigationAction style={{ minWidth: 0 }} label='Doors' value='doors' icon={<Lock />}/>
        { isAdmin &&
          <BottomNavigationAction style={{ minWidth: 0 }} label='Events' value='events' icon={<AssignmentLate />}/>
        }
        <BottomNavigationAction style={{ minWidth: 0 }} label='' value='logout' icon={<ExitToApp />}/>
      </BottomNavigation>
    )
  }
}

export const BottomNav = withRouter(BottomNavComponent)

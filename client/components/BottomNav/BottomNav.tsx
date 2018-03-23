import * as React from 'react'
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation'
import Lock from 'material-ui-icons/Lock'
import Person from 'material-ui-icons/Person'
import People from 'material-ui-icons/People'
import ExitToApp from 'material-ui-icons/ExitToApp'
import AssignmentLate from 'material-ui-icons/AssignmentLate'

interface BottomNavProps {}
interface BottomNavState {
  selected: string
}

export class BottomNav extends React.Component<BottomNavProps, BottomNavState> {
  state = {
    selected: 'recents',
  }

  handleChange = (event: React.ChangeEvent<{}>, selected: string) => {
    this.setState({ selected })
  }

  render() {
    const { selected } = this.state

    return (
      <BottomNavigation value={selected} onChange={this.handleChange}>
        <BottomNavigationAction style={{ minWidth: 0 }} label='Acount' value='account' icon={<Person />} />
        <BottomNavigationAction style={{ minWidth: 0 }} label='Users' value='users' icon={<People />} />
        <BottomNavigationAction style={{ minWidth: 0 }} label='Doors' value='doors' icon={<Lock />} />
        <BottomNavigationAction style={{ minWidth: 0 }} label='Events' value='events' icon={<AssignmentLate />} />
        <BottomNavigationAction style={{ minWidth: 0 }} label='' value='signOut' icon={<ExitToApp />} />
      </BottomNavigation>
    )
  }
}

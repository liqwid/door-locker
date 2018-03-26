import * as React from 'react'
import { Route, Switch } from 'react-router'

import { BottomNav } from 'components/BottomNav'
import { Menu } from 'components/Menu'
import { DoorList } from 'containers/DoorList'
import { UserList } from 'containers/UserList'
import { DoorPage } from 'containers/Door'

const Empty = () => <div />

export interface SidebarProps {
  isAdmin: boolean
  isTablet: boolean
}

export const Sidebar = ({ isAdmin, isTablet }: SidebarProps) => (
  <Menu>
    <Switch>
      <Route path='/doors' exact={true} component={DoorList}/>
      <Route path='/doors/:id/show' component={/*isTablet ? */DoorPage/* : DoorList*/}/>
      <Route path='/account' component={/*isTablet ? *//*UserForm*/Empty/* : Empty*/}/>
      {isAdmin && <Route path='/doors/:id/edit' component={/*isTablet ? *//*DoorForm*/Empty/* : DoorList*/}/>}
      {isAdmin && <Route path='/doors/add' component={/*isTablet ? *//*DoorForm*/Empty/* : DoorList*/}/>}
      {isAdmin && <Route path='/users' exact={true} component={UserList}/>}
      {isAdmin && <Route path='/users/:id/edit' component={/*isTablet ? *//*UserForm*/Empty/* : Empty*/}/>}
      {isAdmin && <Route path='/users/add' component={/*isTablet ? *//*UserForm*/Empty/* : Empty*/}/>}
      {isAdmin && <Route path='/events' component={Empty}/>}
    </Switch>
    <BottomNav isAdmin={isAdmin}/>
  </Menu>
)

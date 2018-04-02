import * as React from 'react'
import { Route, Switch } from 'react-router'

import { BottomNav } from 'components/BottomNav'
import { Menu } from 'components/Menu'
import { DoorList } from 'containers/DoorList'
import { UserList } from 'containers/UserList'
import { EventList } from 'containers/EventList'
import { DoorPage } from 'containers/Door'
import { DoorForm } from 'containers/DoorForm'
import { UserForm } from 'containers/UserForm'

const Empty = () => <div />

export interface SidebarProps {
  isAdmin: boolean
  isTablet: boolean
}

export const Sidebar = ({ isAdmin, isTablet }: SidebarProps) => (
  <Menu>
    <Switch>
      <Route path='/doors' exact={true} component={DoorList}/>
      <Route path='/doors/:id/show' component={DoorPage}/>
      <Route path='/account' component={/*UserForm*/Empty}/>
      {isAdmin && <Route path='/doors/:id/edit' component={DoorForm}/>}
      {isAdmin && <Route path='/doors/add' component={DoorForm}/>}
      {isAdmin && <Route path='/users' exact={true} component={UserList}/>}
      {isAdmin && <Route path='/users/:id/edit' component={UserForm}/>}
      {isAdmin && <Route path='/users/add' component={UserForm}/>}
      {isAdmin && <Route path='/events' component={EventList}/>}
    </Switch>
    <BottomNav isAdmin={isAdmin}/>
  </Menu>
)

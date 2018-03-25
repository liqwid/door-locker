import * as React from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router'

const Empty = () => <div />
const MainWrapper = styled.div`

`

export interface MainProps {
  isAdmin: boolean
}

export const Main = ({ isAdmin }: MainProps) => (
  <MainWrapper>
    <Switch>
      <Route path='/doors' component={Empty}/>
      <Route path='/doors/:id' component={Empty}/>
      <Route path='/account' component={/*UserForm*/Empty}/>
      {isAdmin && <Route path='/doors/:id/edit' component={/*DoorForm*/Empty}/>}
      {isAdmin && <Route path='/doors/add' component={/*DoorForm*/Empty}/>}
      {isAdmin && <Route path='/users' component={Empty}/>}
      {isAdmin && <Route path='/users/:id/edit' component={/*UserForm*/Empty}/>}
      {isAdmin && <Route path='/users/add' component={/*UserForm*/Empty}/>}
      {isAdmin && <Route path='/events' component={/*Events*/Empty}/>}
    </Switch>
  </MainWrapper>
)

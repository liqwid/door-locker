import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized } from 'routing-controllers'
import { User, UserData } from 'models/user.model'
import { getUsers, getUser, addUser, updateUser, deleteUser } from 'services/users.service'
import { MANAGE_USERS, MANAGE_DOORS } from 'models/scopes.model'

/**
 * Controller used to manage users
 * 
 * Accessible for admins/users with MANAGE_USERS role
 */
@JsonController('/users')
export class UsersController {
  @Authorized(MANAGE_USERS)
  @Get()
  get(): Promise<User[]> {
    return getUsers()
  }
  
  @Authorized([MANAGE_USERS, MANAGE_DOORS])
  @Get('/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return getUser(id)
  }

  @Authorized([MANAGE_USERS, MANAGE_DOORS])
  @Post()
  add(@Body() userData: UserData): PromiseLike<User> {
    return addUser(userData)
  }

  @Authorized([MANAGE_USERS, MANAGE_DOORS])
  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() userData: UserData,
  ): PromiseLike<User> {
    return updateUser(id, userData)
  }

  @Authorized([MANAGE_USERS, MANAGE_DOORS])
  @Delete('/:id')
  delete(@Param('id') id: string): PromiseLike<{}> {
    return deleteUser(id)
  }
}

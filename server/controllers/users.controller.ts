import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized } from 'routing-controllers'
import { User } from 'models/user.model'
import { getUsers, addUser, updateUser, deleteUser } from 'services/users.service'
import { MANAGE_USERS } from 'models/scopes.model'

/**
 * Controller used to manage users
 * 
 * Accessible for admins/users with MANAGE_USERS role
 */
@JsonController('/users')
export class UsersController {
  @Authorized(MANAGE_USERS)
  @Get()
  get(): PromiseLike<User[]> {
    return getUsers()
  }

  @Authorized(MANAGE_USERS)
  @Post()
  add(@Body() user: User): PromiseLike<User> {
    return addUser(user)
  }

  @Authorized(MANAGE_USERS)
  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() user: User,
  ): PromiseLike<User> {
    return updateUser(id, user)
  }

  @Authorized(MANAGE_USERS)
  @Delete('/:id')
  delete(@Param('id') id: string): PromiseLike<{}> {
    return deleteUser(id)
  }
}

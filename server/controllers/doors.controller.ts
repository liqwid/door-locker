import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized, CurrentUser } from 'routing-controllers'
import { Door } from 'models/door.model'
import { User } from 'models/user.model'
import { Event } from 'models/event.model'
import { MANAGE_DOORS } from 'models/scopes.model'
import { getDoors, getDoor, addDoor, updateDoor, deleteDoor } from 'services/doors.service'
import { logEvent } from 'services/events.service'

@JsonController('/doors')
export class DoorsController {
  @Get()
  get(): PromiseLike<Door[]> {
    return getDoors()
  }

  @Get('/:id')
  getDoor(@Param('id') id: string): PromiseLike<Door> {
    return getDoor(id)
  }

  @Post('/open/:id')
  open(
    @CurrentUser() user: User,
    @Param('id') doorId: string
  ): PromiseLike<Event> {
    // TODO: add door access check
    return logEvent(doorId, user.id)
  }

  @Authorized(MANAGE_DOORS)
  @Post()
  add(@Body() door: Door): PromiseLike<Door> {
    return addDoor(door)
  }

  @Authorized(MANAGE_DOORS)
  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() door: Door,
  ): PromiseLike<Door> {
    return updateDoor(id, door)
  }

  @Authorized(MANAGE_DOORS)
  @Delete('/:id')
  delete(@Param('id') id: string): PromiseLike<{}> {
    return deleteDoor(id)
  }
}

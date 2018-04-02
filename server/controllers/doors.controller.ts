import { JsonController, Get, Post, Put, Delete, Param,
         Body, Authorized, Req, ForbiddenError } from 'routing-controllers'
import { Request } from 'express'
import { Door } from 'models/door.model'
import { User } from 'models/user.model'
import { MANAGE_DOORS, MANAGE_USERS } from 'models/scopes.model'
import { getDoors, getDoor, addDoor, updateDoor, deleteDoor } from 'services/doors.service'
import { logEvent, DOOR_ACCESS_DENIED_EVENT_TYPE, DOOR_OPEN_EVENT_TYPE } from 'services/events.service'

@JsonController('/doors')
export class DoorsController {
  @Authorized()
  @Get()
  get(): PromiseLike<Door[]> {
    return getDoors()
  }

  @Authorized()
  @Get('/:id')
  getDoor(@Param('id') id: string): PromiseLike<Door> {
    return getDoor(id)
  }

  @Authorized(MANAGE_USERS)
  @Post('/open/:id')
  async open(
    @Req() request: Request,
    @Param('id') doorId: string
  ): Promise<{}> {
    const userId = request.user.sub
    const door = await getDoor(doorId)
    const doorAccessible = (<User[]> door.users)
      .find(({ id }) => id === userId)

    if (doorAccessible) {
      logEvent(doorId, userId, DOOR_OPEN_EVENT_TYPE)
      return { status: 'ok' }
    } else {
      logEvent(doorId, userId, DOOR_ACCESS_DENIED_EVENT_TYPE)
      throw new ForbiddenError('Access denied')
    }
  }

  @Authorized([MANAGE_DOORS, MANAGE_USERS])
  @Post()
  add(@Body() door: Door): Promise<Door> {
    return addDoor(door)
  }

  @Authorized([MANAGE_DOORS, MANAGE_USERS])
  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() door: Door,
  ): Promise<Door> {
    return updateDoor(id, door)
  }

  @Authorized([MANAGE_DOORS, MANAGE_USERS])
  @Delete('/:id')
  delete(@Param('id') id: string): PromiseLike<{}> {
    return deleteDoor(id)
  }
}

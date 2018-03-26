import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized, Req } from 'routing-controllers'
import { Request } from 'express'
import { Door } from 'models/door.model'
import { MANAGE_DOORS, MANAGE_USERS } from 'models/scopes.model'
import { getDoors, getDoor, addDoor, updateDoor, deleteDoor } from 'services/doors.service'
import { logEvent } from 'services/events.service'

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
    await logEvent(doorId, userId)

    return { status: 'ok' }
  }

  @Authorized([MANAGE_DOORS, MANAGE_USERS])
  @Post()
  add(@Body() door: Door): PromiseLike<Door> {
    return addDoor(door)
  }

  @Authorized([MANAGE_DOORS, MANAGE_USERS])
  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() door: Door,
  ): PromiseLike<Door> {
    return updateDoor(id, door)
  }

  @Authorized([MANAGE_DOORS, MANAGE_USERS])
  @Delete('/:id')
  delete(@Param('id') id: string): PromiseLike<{}> {
    return deleteDoor(id)
  }
}

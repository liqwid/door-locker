import { JsonController, Get, Post, Put, Delete, Param, Body, Authorized, Req } from 'routing-controllers'
import { Request } from 'express'
import { Door } from 'models/door.model'
import { Event } from 'models/event.model'
import { MANAGE_DOORS } from 'models/scopes.model'
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

  @Authorized()
  @Post('/open/:id')
  open(
    @Req() request: Request,
    @Param('id') doorId: string
  ): PromiseLike<Event> {
    const userId = request.user.sub
    return logEvent(doorId, userId)
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

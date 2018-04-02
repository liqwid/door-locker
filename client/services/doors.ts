import { Injectable } from 'react.di'

import { CollectionService } from 'services/collection' 
import { Door } from 'models/door'

const ACCESS_DENIED_TIMEOUT = 3000
const OPENED_TIMEOUT = 3000

@Injectable
export class DoorService extends CollectionService<Door> {
  endPoint = '/doors'

  public openDoor(id: string) {
    this.restApi.post({
      url: `${this.endPoint}/open/${id}`
    })
    .subscribe(
      () => this.onDoorOpened(id),
      () => this.onAccessDenied(id)
    )
  }

  private onAccessDenied = (id: string) => {
    this.updateItemParam(id, 'accessDenied', true)
    setTimeout(() => this.updateItemParam(id, 'accessDenied', false), ACCESS_DENIED_TIMEOUT)
  }

  private onDoorOpened = (id: string) => {
    this.updateItemParam(id, 'opened', true)
    setTimeout(() => this.updateItemParam(id, 'opened', false), OPENED_TIMEOUT)
  }
}

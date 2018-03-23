import { Injectable } from 'react.di'

import { CollectionService } from 'services/collection' 
import { Door } from 'models/door'

@Injectable
export class DoorService extends CollectionService<Door> {
  endPoint = '/doors'
}

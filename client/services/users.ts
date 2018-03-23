import { Injectable } from 'react.di'

import { CollectionService } from 'services/collection' 
import { User } from 'models/user'

@Injectable
export class UserService extends CollectionService<User> {
  endPoint = '/users'
}

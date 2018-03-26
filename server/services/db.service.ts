import { sync as syncUsers } from 'services/users.service'
import { sync as syncDoors } from 'services/doors.service'
import { sync as syncEvents } from 'services/events.service'
import { sequelize } from 'services/sequelize'
import { DoorORM } from 'models/door.model'
import { UserORM } from 'models/user.model'
import { EventORM } from 'models/event.model'

const UserDoor = sequelize.define('user_door', {})
DoorORM.belongsToMany(UserORM, { through: UserDoor })
UserORM.belongsToMany(DoorORM, { through: UserDoor })
EventORM.belongsTo(DoorORM)
EventORM.belongsTo(UserORM)

export function syncWithDb(): Promise<{}> {
  return Promise.all([
    syncUsers(),
    syncDoors(),
    UserDoor.sync()
  ])
  .then(syncEvents)
}

import * as Sequelize from 'sequelize'
import { UserORM, User } from 'models/user.model'
import { DoorORM } from 'models/door.model'
import { EventORM } from 'models/event.model'
import { managementClient } from './auth.service'
import { User as AuthUser } from 'auth0'

/**
 * Manually syncs auth db with local db
 * Auth db is regarded as the "source of truth"
 * Local db contains user privileges for auth db users
 */
export async function syncUsers(): Promise<{}> {
  const remainingUsersInAuthDb: AuthUser[] = <AuthUser[]> await managementClient.getUsers()

  await UserORM.sync()
  const usersInDb = await UserORM.findAll()

  // Removes users that are not present in auth from db
  usersInDb.forEach((userInstance: Sequelize.Instance<User>) => {
    const dbId = userInstance.get('id')
    const userAuthIndex = remainingUsersInAuthDb
    .findIndex((authUser) => authUser.user_id === dbId)
    
    if (userAuthIndex > -1) remainingUsersInAuthDb.splice(userAuthIndex, 1)
    else UserORM.destroy({ where: { id: dbId } })
  })

  // Adds users that are missing from db and present in auth to db
  remainingUsersInAuthDb.forEach(({ user_id }) => {
    UserORM.create({ id: user_id })
  })

  return {}
}

export function syncWithDb(): Promise<{}> {
  return Promise.all([
    syncUsers(),
    DoorORM.sync(),
  ]).then(() => EventORM.sync())
}

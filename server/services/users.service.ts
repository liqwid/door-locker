import { Instance } from 'sequelize'

import { User, NewUser, UserORM } from 'models/user.model'
import { DoorORM } from 'models/door.model'
import { extractRawData } from 'utils/orm'
import { managementClient, MANAGING_CLIENT_ID } from 'services/auth.service'
import { User as AuthUser, CreateUserData } from 'auth0'

// TODO: move to env variable
const USER_CONNECTION_TYPE = 'Username-Password-Authentication'

export function getUsers(): Promise<User[]> {
  return Promise.all([
    // Get db entries
    UserORM.findAll()
    .then((userInstances) => userInstances.map(extractRawData)),
    // Get auth db entries
    managementClient.getUsers()
  ])
  .then((usersWrapper: ({}|AuthUser[]|User[])[]): User[] => {
    const dbUsers: User[] = <User[]> usersWrapper[0]
    const authUsers: AuthUser[] = <AuthUser[]> usersWrapper[1]
    
    // Add user rights to each auth user
    return authUsers.map((authUser: AuthUser): User => {
      const dbUser = dbUsers.find(({ id }) => id === authUser.user_id)
      const isAdmin: boolean = dbUser ? <boolean> dbUser.isAdmin : false

      return <User> {
        ...authUser,
        id: authUser.user_id,
        isAdmin
      }
    })
  })
}

export function getUser(id: string): Promise<User> {
  return Promise.all([
    UserORM.findOne({ where: { id }, include: [
      { model: DoorORM, as: 'doors' }
    ]})
    .then(extractRawData),
    managementClient.getUser({ id })
  ])
  .then((userWrapper: ({}|User|AuthUser)[]): User => {
    const [ dbUser, authUser ] = <[User, AuthUser]> userWrapper

    if (!dbUser.isAdmin) dbUser.isAdmin = false

    return <User> {
      ...authUser,
      ...dbUser
    }
  })
}

export async function addUser(userData: NewUser): Promise<User> {
  const { isAdmin, doors, email, username, password } = userData
  const authUserData: CreateUserData = {
    email, username, password, connection: USER_CONNECTION_TYPE
  }
  const authUser = await managementClient.createUser(authUserData)
  const { user_id } = authUser
  const user: User = { isAdmin, id: <string> user_id }

  const dbUser: any = await UserORM.create(user)
  if (doors) {
    await dbUser.setDoors(doors.map(({ id: doorId }) => doorId))
  }

  return { ...user, ...authUser, doors }
}

export async function updateUser(id: string, userData: User): Promise<User> {
  const { isAdmin, doors, email, username, password } = userData

  const authUser = await managementClient.getUser({ id })

  await UserORM.update({ isAdmin: isAdmin }, { where: { id: <string> id }})
  const dbUser: any = await UserORM.findOne({ where: { id }})
  if (doors) {
    await dbUser.setDoors(doors.map(({ id: doorId }) => doorId))
  }
  if (email && email !== authUser.email) {
    await managementClient.updateUser(
      { id },
      { email, connection: USER_CONNECTION_TYPE, client_id: MANAGING_CLIENT_ID }
    )
  }
  if (username && username !== authUser.username) {
    await managementClient.updateUser(
      { id },
      { username, connection: USER_CONNECTION_TYPE }
    )
  }
  if (password) {
    await managementClient.updateUser(
      { id },
      { password, connection: USER_CONNECTION_TYPE }
    )
  }

  return <User> { ...authUser, ...extractRawData(dbUser) }
}

export async function deleteUser(id: string) {
  return Promise.all([
    UserORM.destroy({ where: { id }}),
    managementClient.deleteUser({ id })
  ])
}

/**
 * Manually syncs auth db with local db
 * Auth db is regarded as the "source of truth"
 * Local db contains user privileges for auth db users
 */
export async function sync(): Promise<{}> {
  const remainingUsersInAuthDb: AuthUser[] = <AuthUser[]> await managementClient.getUsers()

  await UserORM.sync()
  const usersInDb = await UserORM.findAll()

  // Removes users that are not present in auth from db
  usersInDb.forEach((userInstance: Instance<User>) => {
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

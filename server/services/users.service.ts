import { NotFoundError } from 'routing-controllers'
import { Instance } from 'sequelize'

import { User, UserData, UserORM } from 'models/user.model'
import { extractRawData } from 'utils/orm'
import { managementClient } from './auth.service'
import { User as AuthUser, CreateUserData as AuthCreateUserData } from 'auth0'

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
    UserORM.findOne({ where: { id }})
    .then(extractRawData),
    managementClient.getUser({ id })
  ])
  .then((userWrapper: ({}|User|AuthUser)[]): User => {
    const dbUser: User = <User> userWrapper[0]
    const authUser: AuthUser = <AuthUser> userWrapper[0]
    const isAdmin: boolean = dbUser ? <boolean> dbUser.isAdmin : false

    return <User> {
      ...authUser,
      id: authUser.user_id,
      isAdmin
    }
  })
}

export async function addUser(userData: UserData): Promise<User> {
  const { isAdmin, email, username, password } = userData
  const authUserData: AuthCreateUserData = {
    email, username, password, connection: USER_CONNECTION_TYPE
  }
  const user = await managementClient.createUser(authUserData)
  const { user_id } = user
  const dbUser: User = { isAdmin, id: <string> user_id }

  await UserORM.create(dbUser)

  return { ...dbUser, ...user }
}

export async function updateUser(id: string, userData: UserData): Promise<User> {
  await managementClient.updateUser({ id }, userData)
  
  return UserORM.update({ isAdmin: userData.isAdmin }, { where: { id: <string> id }})
  .then(([ count, users ]: [1, Instance<User>[]]): User => {
    let [ updatedUser ] = users
    if (!updatedUser) throw new NotFoundError(`instance with id ${id} was not found in db`)
    return extractRawData(updatedUser)
  })
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

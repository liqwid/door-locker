import { Action } from 'routing-controllers'
import { verify } from 'jsonwebtoken'
import { ManagementClient } from 'auth0'

const AUTH_DOMAIN: string = <string> process.env.REACT_APP_AUTH0_DOMAIN
const AUTH_SECRET: string = <string> process.env.REACT_APP_AUTH0_CLIENT_SECRET

const MANAGE_DOMAIN: string = <string> process.env.AUTH0_DOMAIN
const MANAGE_SECRET: string = <string> process.env.AUTH0_CLIENT_SECRET
const MANAGE_CLIENT_ID: string = <string> process.env.AUTH0_CLIENT_ID

const AUTH_OPTIONS = {
  issuer: AUTH_DOMAIN,
  audience: 'https://app-locker.heroku.com/',
  algorithms: ['RS256'],
}

export const managementClient = new ManagementClient({
  domain: MANAGE_DOMAIN,
  clientId: MANAGE_CLIENT_ID,
  clientSecret: MANAGE_SECRET,
  scope: 'read:users update:users delete:users create:users',
})

export function checkAuthorization(action: Action, roles: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const token = action.request.headers.authorization

    verify(token, AUTH_SECRET, AUTH_OPTIONS, (err, decoded) => {
      if (err) resolve(false)
      
      resolve(true)
    })
  })
}

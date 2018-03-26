import { Action } from 'routing-controllers'
import * as jwks from 'express-jwt'
import { expressJwtSecret } from 'jwks-rsa'
import { ManagementClient } from 'auth0'

import { getUser } from 'services/users.service'

import { MANAGE_DOORS, MANAGE_USERS } from 'models/scopes.model'

const AUTH_DOMAIN: string = <string> process.env.REACT_APP_AUTH0_DOMAIN
const AUDIENCE: string = <string> process.env.REACT_APP_AUDIENCE

const MANAGING_DOMAN: string = <string> process.env.AUTH0_DOMAIN
const MANAGING_SECRET: string = <string> process.env.AUTH0_CLIENT_SECRET
const MANAGING_CLIENT_ID: string = <string> process.env.AUTH0_CLIENT_ID

const AUTH_OPTIONS = {
  issuer: `https://${AUTH_DOMAIN}/`,
  audience: AUDIENCE,
  algorithms: ['RS256'],
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH_DOMAIN}/.well-known/jwks.json`
  })
}

export const managementClient = new ManagementClient({
  domain: MANAGING_DOMAN,
  clientId: MANAGING_CLIENT_ID,
  clientSecret: MANAGING_SECRET,
  scope: 'read:users update:users delete:users create:users',
})

export function checkAuthorization(action: Action, scopes: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    jwks(AUTH_OPTIONS)(action.request, action.response, (err) => {
      if (err) return resolve(false)

      if (scopes.indexOf(MANAGE_USERS) > -1 || scopes.indexOf(MANAGE_DOORS) > -1) {
        const userId = action.request.user.sub
        getUser(userId)
        .then(({ isAdmin }) => {
          resolve(isAdmin)
        })
        return
      }
      
      resolve(true)
    })
  })
}

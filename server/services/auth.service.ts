import { Action } from 'routing-controllers'
import { verify } from 'jsonwebtoken'

const AUTH_OPTIONS = {
  issuer: <string> process.env.AUTH0_DOMAIN,
  audience: 'https://app-locker.heroku.com/',
  algorithms: ['RS256'],
}

const SECRET: string = <string> process.env.AUTH0_CLIENT_SECRET

export function authorizationChecker(action: Action, roles: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const token = action.request.headers.authorization

    verify(token, SECRET, AUTH_OPTIONS, (err, decoded) => {
      if (err) resolve(false)
      
      resolve(true)
    })
  })
}

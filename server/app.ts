import 'reflect-metadata'
import { resolve } from 'path'
import * as express from 'express'
import { createExpressServer } from 'routing-controllers'
import { DoorsController } from 'controllers/doors.controller'
import { authorizationChecker } from 'services/auth.service'
import { assetsPath } from 'utils/paths'

const app: express.Express = createExpressServer({
  routePrefix: '/api',
  authorizationChecker,
  controllers: [ DoorsController ]
})

app.use(express.static(assetsPath))

app.get('*', (request: express.Request, response: express.Response) => {
  response.sendFile(resolve(assetsPath, 'index.html'))
})

export default app

import 'reflect-metadata'
import { resolve } from 'path'
import * as express from 'express'
import { createExpressServer } from 'routing-controllers'
import { DoorsController } from 'controllers/doors.controller'
import { checkAuthorization } from 'services/auth.service'
import { assetsPath } from 'utils/paths'
import { UsersController } from 'controllers/users.controller'
import { EventsController } from 'controllers/events.controller'

const app: express.Express = createExpressServer({
  routePrefix: '/api',
  authorizationChecker: checkAuthorization,
  controllers: [ DoorsController, UsersController, EventsController ]
})

app.use(express.static(assetsPath))

app.get('*', (request: express.Request, response: express.Response) => {
  response.sendFile(resolve(assetsPath, 'index.html'))
})

export default app

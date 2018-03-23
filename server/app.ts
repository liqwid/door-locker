import 'reflect-metadata'
import * as express from 'express'
import { createExpressServer } from 'routing-controllers'
import { DoorsController } from 'controllers/doors.controller'
import { authorizationChecker } from 'services/auth.service'
import { assetsPath } from 'utils/paths'

const app: express.Express = createExpressServer({
  authorizationChecker,
  controllers: [ DoorsController ]
})

app.use(express.static(assetsPath))

export default app

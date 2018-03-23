import * as dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { syncWithDb } from 'services/db.service'

const PORT = process.env.PORT || 3000

syncWithDb().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
  })
  
  app.on('error', console.error)
})

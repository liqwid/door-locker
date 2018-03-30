import { Instance } from 'sequelize'

export function extractRawData<T>(intance: Instance<T>): T {
  return intance.get({ plain: true })
}

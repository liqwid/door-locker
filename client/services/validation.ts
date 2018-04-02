import { ValidationError } from 'class-validator'

export interface ValidationResponse {
  errors: ValidationError[]
  message: string
  name: string
  stack: string
}

export function formatValidationErrors({ errors }: ValidationResponse) {
  return errors.reduce(
    (errorContainer, { property, constraints }) => ({
      ...errorContainer,
      [property]: Object.values(constraints).join('; ')
    })
  ,
    {}
  )
}

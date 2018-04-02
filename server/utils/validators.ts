import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function MinLengthOrEmpty(length: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [ length ],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [ minLength ] = args.constraints
          return  typeof value === 'string' &&
          (value.length >= minLength || value.length === 0)
        }
      }
    })
  }
}

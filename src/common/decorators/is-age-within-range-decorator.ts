import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

export function IsAgeWithinRange(minAge: number, maxAge: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAgeWithinRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false; // Si no hay valor, es inválido.
          
          // Parseamos la fecha de nacimiento de forma estricta.
          const birthDate = moment(value, 'YYYY-MM-DD', true);
          if (!birthDate.isValid()) return false;
          
          const age = moment().diff(birthDate, 'years');
          return age >= minAge && age <= maxAge;
        },
        defaultMessage(args: ValidationArguments) {
          return `La edad debe estar entre ${minAge} y ${maxAge} años.`;
        }
      },
    });
  };
}

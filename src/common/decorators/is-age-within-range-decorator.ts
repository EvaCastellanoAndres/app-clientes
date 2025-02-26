import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ async: false })
export class IsAgeWithinRangeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const minAge = args.constraints[0]; // Edad mínima
    const maxAge = args.constraints[1]; // Edad máxima

    if (!value) return false;

    const birthDate = moment(value, 'YYYY-MM-DD');
    const currentDate = moment();
    const age = currentDate.diff(birthDate, 'years');

    return age >= minAge && age <= maxAge;
  }

  defaultMessage(args: ValidationArguments): string {
    return `La edad debe estar entre ${args.constraints[0]} y ${args.constraints[1]} años.`;
  }
}

export function IsAgeWithinRange(minAge: number, maxAge: number, validationOptions?: any) {
  return Validate(IsAgeWithinRangeConstraint, [minAge, maxAge], validationOptions);
}

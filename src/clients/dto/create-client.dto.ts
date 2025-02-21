import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  Matches,
  IsArray,
  IsOptional,
  isString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAgeWithinRange } from 'src/common/decorators/is-age-within-range-decorator';

export class CreateClientDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido1: string;

  @IsOptional()
  @IsString()
  apellido2: string;

  @IsOptional()
  @IsString()
  identificacion: string;

  @IsNotEmpty()
  @IsDateString(
    { strict: true },
    { message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD.' },
  )
  @IsAgeWithinRange(18, 60, {
    message: 'La edad debe estar entre 18 y 60 años.',
  })
  fechaNacimiento: string;

  @IsNotEmpty()
  //@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //@IsArray()
  // @IsString({ each: true })
 // @IsString()
  calle: string;

  @IsNotEmpty()
  //@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //@IsArray()
  // @IsString({ each: true })
  //@IsString()
  portal: string;

  @IsOptional()
  //@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //@IsArray()
  // @IsString({ each: true })
  //@IsString()
  piso: string;

  @IsOptional()
  //@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //@IsArray()
  // @IsString({ each: true })
  //@IsString()
  escalera: string;

  @IsNotEmpty()
  /*  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray() */
  @Transform(({ value }) => Number(value))
  @IsNumber()
  codigoPostal: number;

  @IsNotEmpty()
  //@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //@IsArray()
  // @IsString({ each: true })
 // @IsString()
  ciudad: string;

  @IsNotEmpty()
  //@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //@IsArray()
  // @IsString({ each: true })
 // @IsString()
  provincia: string;

  @IsOptional()
  //@IsArray()
  //@IsString()
  imagenes: string[];
}

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  Matches,
  IsArray,
  IsOptional,
  IsUrl,
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
  @IsString()
  calle: string;

  @IsNotEmpty()
  @IsString()
  portal: string;

  @IsOptional()
  @IsString()
  piso: string;

  @IsOptional()
  @IsString()
  escalera: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  codigoPostal: number;

  @IsNotEmpty()
  @IsString()
  ciudad: string;

  @IsNotEmpty()
  @IsString()
  provincia: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imagenes?: string[];
}

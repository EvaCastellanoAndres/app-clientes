import { IsNotEmpty, IsString, IsNumber, IsDateString, Matches, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAgeWithinRange } from 'src/common/decorators/is-age-within-range-decorator';

export class CreateClientDto {
  id:number;

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
  @IsDateString({ strict: true }, { message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD.' })
  @IsAgeWithinRange(18, 60, { message: 'La edad debe estar entre 18 y 60 años.' })
  fechaNacimiento: string;

  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) 
  @IsArray()
  @IsString({ each: true }) 
  calle: string[];

  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) 
  @IsArray()
  @IsString({ each: true }) 
  portal: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) 
  @IsArray()
  @IsString({ each: true }) 
  piso: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) 
  @IsArray()
  @IsString({ each: true }) 
  escalera: string[];

  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)])) 
  @IsArray()
  @IsNumber({}, { each: true })
  codigoPostal: number[];

  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) 
  @IsArray()
  @IsString({ each: true })
  ciudad: string[];

  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) 
  @IsArray()
  @IsString({ each: true }) 
  provincia: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) 
  imagenes?: string[];
}

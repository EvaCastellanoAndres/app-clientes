import { IsNotEmpty, IsString, IsNumber, IsDateString, Matches, IsArray, IsOptional, IsNotIn } from 'class-validator';
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

  @IsOptional()
  @IsString()
  calle: string;

  @IsOptional()
  portal: string;

  @IsOptional()
  piso: string;

  @IsOptional()
  escalera: string;

  @IsOptional()
  @IsNumber()
  codigoPostal: number;

  @IsOptional()
  @IsString()
  ciudad: string;

  @IsOptional()
  @IsString()
  provincia: string;

  @IsOptional()
  @IsString()
  poblacion:string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) 
  imagenes?: string[];
}

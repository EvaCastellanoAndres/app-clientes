import { IsNotEmpty, IsString, IsNumber, IsDateString, Matches, IsArray, IsOptional } from 'class-validator';
import { IsAgeWithinRange } from 'src/common/decorators/is-age-within-range-decorator';
// TODO:https://docs.nestjs.com/techniques/file-upload

export class CreateClientDto {
  id:number;

  @IsOptional()
  @IsNumber()
  codigo: number;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
  nombre: string;

  @IsOptional()
  @IsString()
  apellido1: string;

  @IsOptional()
  @IsString()
  apellido2: string;

  @IsOptional()
  @IsString()
  identificacion: string;

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD.' })
  @IsAgeWithinRange(18, 60, { message: 'La edad debe estar entre 18 y 60 años.' })
  fechaNacimiento: string;

  @IsOptional()
  @IsString()
  calle: string;

  @IsOptional()
  portal: number;

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

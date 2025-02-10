import { IsNotEmpty, IsString, IsNumber, IsDate, Min, Max, IsDateString, Matches } from 'class-validator';
import { IsAgeWithinRange } from 'src/common/decorators/is-age-within-range-decorator';
// TODO:https://docs.nestjs.com/techniques/file-upload

export class CreateClientDto {
  id:number;

  @IsNotEmpty()
  @IsNumber()
  codigo: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido1: string;

  @IsString()
  apellido2: string;

  @IsString()
  identificacion: string;

  @IsNotEmpty()
  @IsDateString({ strict: true }, { message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD.' })
  @IsAgeWithinRange(18, 60, { message: 'La edad debe estar entre 18 y 60 años.' })
  fechaNacimiento: string;





  @IsString()
  calle: string;

  portal: number;
  piso: string;
  escalera: string;

  @IsNumber()
  codigoPostal: number;

  @IsString()
  ciudad: string;

  @IsString()
  provincia: string;

  @IsString()
  poblacion:string;
}

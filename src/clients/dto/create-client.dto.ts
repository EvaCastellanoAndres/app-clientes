import { IsNotEmpty, IsPostalCode } from "class-validator";

export class CreateClientDto {
  id:number;

  @IsNotEmpty()
  codigo: number;

  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido1: string;

  apellido2: string;
  identificacion: string;

  @IsNotEmpty()
  fechaNacimiento: Date;

  calle: string;
  portal: number;
  piso: string;
  escalera: string;

  @IsPostalCode()
  codigoPostal: number;

  ciudad: string;
  provincia: string;
  poblacion:string;
}

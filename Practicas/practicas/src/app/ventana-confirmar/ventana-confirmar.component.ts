import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';


export interface DatosVentana {
  codigo: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  identificacion: string;
  fechaNacimiento: Date;
  calle: string;
  portal: number;
  piso: string;
  escalera: string;
  codigoPostal: number;
  ciudad: string;
  provincia: string;
}
@Component({
  selector: 'app-ventana-confirmar',
  imports: [ MatDialogModule ],
  templateUrl: './ventana-confirmar.component.html',
  styleUrl: './ventana-confirmar.component.scss'
})
export class VentanaConfirmarComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DatosVentana){}
}

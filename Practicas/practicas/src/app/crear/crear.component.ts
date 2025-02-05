import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { VentanaConfirmarComponent } from '../ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-crear',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})
export class CrearComponent {
  formularioCliente = new FormGroup ({
    clienteCodigo: new FormControl(),
    clienteNombre: new FormControl(),
    clienteApellido1: new FormControl(),
    clienteApellido2: new FormControl(),
    clienteDNI: new FormControl(),
    clientePasaporte: new FormControl(),
    clienteFechaNacimiento: new FormControl(),
    clienteCalle: new FormControl(),
    clientePortal: new FormControl(),
    clienteNumero: new FormControl(),
    clientePiso: new FormControl(),
    clienteEscalera: new FormControl(),
    clienteCodigoPostal: new FormControl(),
    clienteCiudad: new FormControl(),
    clienteProvincia: new FormControl(),
  })

  codigo: number = 0;
  nombre: string = '';
  apellido1: string = '';
  apellido2: string = '';
  identificacion: string = '';
  fechaNacimiento: Date = new Date;
  calle: string = '';
  portal: number = 0;
  piso: string = '';
  escalera: string = '';
  codigoPostal: number = 0;
  ciudad: string = '';
  provincia: string = ''; 
  
  constructor(public confirma: MatDialog) {}

  abrirConfirmacion () {
      this.confirma.open(VentanaConfirmarComponent, { 
      data: {codigo: this.codigo,
             nombre: this.nombre,
             apellido1: this.apellido1,
             apellido2: this.apellido2,
             identificacion: this.identificacion,
             fechaNacimiento: this.fechaNacimiento,
             calle: this.calle,
             portal: this.portal,
             piso: this.piso,
             escalera: this.escalera,
             codigoPostal: this.codigoPostal,
             ciudad: this.ciudad,
             provincia: this.provincia
            }
    });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../Service/cliente.service';

export interface DatosVentana {
  id: string,
  codigo: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  identificacion: string;
  fechaNacimiento: Date;
  calle: string;
  portal: string;
  piso: string;
  escalera: string;
  codigoPostal: number;
  ciudad: string;
  provincia: string;
  imagenes: [];
}
@Component({
  selector: 'app-ventana-confirmar',
  imports: [ MatDialogModule, CommonModule ],
  templateUrl: './ventana-confirmar.component.html',
  styleUrl: './ventana-confirmar.component.scss'
})
export class VentanaConfirmarComponent {
  mensajeError: string = '';
  editMode: boolean = false;
  clienteId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<VentanaConfirmarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosVentana,
    private clienteService: ClienteService,
    private router: Router
  ){}

  confirmar () {
    if (this.data.id) {
      console.log("Editando cliente con ID:", this.data.id);
      this.clienteService.actualizarCliente(this.data.id, this.data).subscribe(() => {
        this.dialogRef.close(true);
        this.router.navigate(['/inicio']);
      });
    } else {
      console.log("Creando nuevo cliente:", this.data);
      this.clienteService.crearCliente(this.data).subscribe(() => {
        this.dialogRef.close(true);
        this.router.navigate(['/inicio']);
      });
    }
    /*this.clienteService.crearCliente(this.data).subscribe(() => {
      this.dialogRef.close();
      this.router.navigate(['/inicio']);
    }
  );*/
  }

  cancelar() {
    this.dialogRef.close();
  }
}

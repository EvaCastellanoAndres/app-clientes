import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClienteService } from '../Service/cliente.service';

export interface DatosVentana {
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
  imports: [ MatDialogModule ],
  templateUrl: './ventana-confirmar.component.html',
  styleUrl: './ventana-confirmar.component.scss'
})
export class VentanaConfirmarComponent {
  constructor(
    public dialogRef: MatDialogRef<VentanaConfirmarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosVentana,
    private clienteService: ClienteService,
    private router: Router
  ){}

  confirmar () {
    console.log("Confirmar presionado, enviando datos:", this.data);

  this.clienteService.crearCliente(this.data).subscribe(
    response => {
      console.log("Cliente guardado con éxito:", response);
      this.dialogRef.close();
      this.router.navigate(['/inicio']);
    },
    error => {
      console.error("Error al guardar el cliente:", error);
    }
  );
    /*this.dialogRef.close(this.data);*/
    /*this.clienteService.crearCliente(this.data).subscribe(() => {
      this.dialogRef.close();
      this.router.navigate(['/inicio']);
    });*/
    /*this.dialogRef.close();
    setTimeout(() => {
      this.router.navigate(['']);
    }, 300);*/
  }

  cancelar() {
    this.dialogRef.close();
  }
}

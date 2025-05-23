import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventana-permisos',
  imports: [ MatDialogModule, MatDialogActions, MatButtonModule, CommonModule],
  templateUrl: './ventana-permisos.component.html',
  styleUrl: './ventana-permisos.component.scss'
})
export class VentanaPermisosComponent {

  constructor(public dialogRef: MatDialogRef<VentanaPermisosComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  aceptar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}

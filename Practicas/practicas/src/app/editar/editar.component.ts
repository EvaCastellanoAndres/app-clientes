import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../Service/cliente.service';
import { FormsModule,ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VentanaConfirmarComponent } from '../ventana-confirmar/ventana-confirmar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarComponent implements OnInit {
  clienteId: string | null = null;
  formularioCliente: FormGroup;

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.formularioCliente = this.fb.group({
      codigo: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      tipoDocumento: ['dni'],
      identificacion: [''],
      fechaNacimiento: [''],
      calle: [''],
      portal: [''],
      piso: [''],
      escalera: [''],
      codigoPostal: [''],
      ciudad: [''],
      provincia: [''],
      imagenes: ['']
    });
  }

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.cargarCliente(this.clienteId);
    }
  }

  cargarCliente(id: string) {
    this.clienteService.obtenerCliente(id).subscribe(cliente => {
      this.formularioCliente.patchValue(cliente);
    });
  }

  abrirConfirmacion() {
    if (this.formularioCliente.valid) {
      const dialogRef = this.dialog.open(VentanaConfirmarComponent, {
        data: {
          id: this.clienteId,
          ...this.formularioCliente.value,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("📌 Resultado de la ventana de confirmación en EDITAR:", result);
        if (result === true) {
            console.log("✅ Cliente actualizado correctamente.");
        } else {
            console.log("❌ Edición cancelada.");
        }
    });

      /*dialogRef.afterClosed().subscribe(result => {
        console.log("Resultado de la ventana de confirmación:", result); 
        if (result) {
          this.guardarCliente();
        }
      });*/
    }
  }

  guardarCliente() {
    if (this.formularioCliente.valid && this.clienteId) {
      const cliente = this.formularioCliente.value;
      console.log("Cliente enviado:", cliente); 
      this.clienteService.actualizarCliente(this.clienteId, cliente).subscribe(response => {
        console.log("Respuesta del servidor:", response);
        this.router.navigate(['/inicio']);
      }, error => {
        console.error("Error al actualizar el cliente:", error);
      });
    }
  }

}

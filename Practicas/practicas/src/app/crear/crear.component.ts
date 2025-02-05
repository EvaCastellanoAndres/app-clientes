import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  nombreValido() {
    
  }
}

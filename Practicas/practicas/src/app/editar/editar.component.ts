import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../Service/cliente.service';
import { FormsModule,ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, ValidatorFn, ValidationErrors, Validators, FormArray } from '@angular/forms';
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
  imagenesPrevisualizadas: string[] = [];

  constructor (
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.formularioCliente = this.fb.group({
      codigo: [''],
      nombre: ['', [requeridoValidator(), nombreValidator()]],
      apellido1: ['', [requeridoValidator(), nombreValidator()]],
      apellido2: [''],
      tipoDocumento: ['dni'],
      identificacion: [''],
      fechaNacimiento: ['', [edadValidator()]],
      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      piso: [''],
      escalera: [''],
      codigoPostal: ['', [Validators.required]],
      ciudad: ['', [requeridoValidator(), nombreValidator()]],
      provincia: ['', [requeridoValidator(), nombreValidator()]],
      imagenes: this.fb.array([])
    });

    this.formularioCliente.get('identificacion')?.setValidators([
          Validators.required, identificacionValidator(this.formularioCliente.get('tipoDocumento')!)]);
  }

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.cargarCliente(this.clienteId);
    }
  }

  cargarCliente(id: string) {
    this.clienteService.obtenerCliente(id).subscribe(cliente => {
      if (!cliente) return;
  
      const clienteSinNull = { ...cliente };
  
      Object.keys(clienteSinNull).forEach(key => {
        if (clienteSinNull[key] === null || clienteSinNull[key] === 'null' || clienteSinNull[key] === undefined) {
          clienteSinNull[key] = '';
        }
      });

      if (cliente.imagenes) {
        this.imagenesPrevisualizadas = cliente.imagenes;
        cliente.imagenes.forEach((imagen: string) => {
          this.imagenes.push(this.fb.control(imagen));
        });
      }
      this.formularioCliente.patchValue(clienteSinNull);
      this.formularioCliente.get('codigo')?.disable();
    });
  }

  get imagenes(): FormArray {
    return this.formularioCliente.get('imagenes') as FormArray;
  }

 /*  agregarInput(): void {
    if (this.imagenes.length < 4) {
      this.imagenes.push(this.fb.control(null));
    }
  }

  manejarCambioArchivo(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesPrevisualizadas[index] = e.target.result;
        };
        reader.readAsDataURL(file);

        this.imagenes.at(index).setValue(file);
        if (this.imagenes.length < 4 && index === this.imagenes.length - 1) {
          this.agregarInput();
        }
      } else {
        alert('Por favor, selecciona un archivo de imagen válido.');
        event.target.value = '';
      }
    } else {
      alert('No se ha seleccionado ningún archivo.');
    }
  }

  abrirSelectorImagen(index: number) {
    const fileInputs = document.querySelectorAll<HTMLInputElement>("#imagenes");
    if (fileInputs[index]) {
      fileInputs[index].click();
    }
  } */

  abrirConfirmacion() {
    if (this.formularioCliente.valid) {
      this.dialog.open(VentanaConfirmarComponent, {
        data: {
          id: this.clienteId,
          ...this.formularioCliente.value,
        }
      });
    } else {
      Object.values(this.formularioCliente.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}

export function requeridoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value ? null : { requerido: true };
  };
}

export function nombreValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    if (!regex.test(value)) {
      return { nombreInvalido: true };
    }

    return null;
  };
}

export function identificacionValidator(tipoDocumentoControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const tipoDocumento = tipoDocumentoControl.value;

    if (!value || typeof value !== 'string') {
      return { identificacionInvalida: true };
    }

    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const pasaporteRegex = /^[A-z0-9]{2,3}[0-9]{6}$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    let error = null;

    switch (tipoDocumento) {
      case 'dni':
        if (!dniRegex.test(value) || !validarLetraDNI(value)) {
          error = { dniInvalido: true }
        }
        break;
      case 'pasaporte':
        if (!pasaporteRegex.test(value)) {
          error = { pasaporteInvalido: true};
        }
        break;
      case 'nie':
        if (!nieRegex.test(value) || !validarNIE(value)) {
          error = { nieInvalido: true };
        }
        break;   
    }

    function validarLetraDNI(dni: string): boolean {
      const numeroDNI = parseInt(dni.slice(0,8), 10);
      const letraDNI = dni.charAt(8).toUpperCase();
      const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'

      return letraDNI == letras[numeroDNI % 23];
    }

    function validarNIE(nie: string): boolean {
      let prefijoNIE = nie.charAt(0).toUpperCase();
      switch (prefijoNIE) {
        case 'X':
          prefijoNIE = '0';
          break;
        case 'Y':
          prefijoNIE = '1';
          break;
        case 'Z':
          prefijoNIE = '2';
          break;
      }

      return validarLetraDNI(prefijoNIE + nie.substring(1));
    }
    return error;
  };
}

export function edadValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { edadInvalida: true };
    }

    const fechaNac = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const difMes = hoy.getMonth() - fechaNac.getMonth();
    const difDia = hoy.getDate() - fechaNac.getDate();

    if (
      edad < 18 ||
      edad > 60 ||
      (edad === 18 && difMes < 0) ||
      (edad === 18 && difMes === 0 && difDia < 0) ||
      (edad === 60 && difMes > 0) ||
      (edad === 60 && difMes === 0 && difDia > 0)
    ) {
      return { edadInvalida: true };
    }
    return null;
  };
}

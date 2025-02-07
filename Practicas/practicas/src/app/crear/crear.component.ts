import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { VentanaConfirmarComponent } from '../ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-crear',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})

export class CrearComponent {

  formularioCliente: FormGroup; 
  
  constructor(private fb: FormBuilder, public confirma: MatDialog) {
    this.formularioCliente = this.fb.group({
      clienteCodigo: ['', Validators.required],
      clienteNombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚ ]+$/)]],
      clienteApellido1: [],
      clienteApellido2: [],
      tipoDocumento: ['dni'],
      clienteIdentificacion: [''],
      clienteFechaNacimiento: ['', [Validators.required, edadValidator()]],
      clienteCalle: [],
      clientePortal: [],
      clienteNumero: [],
      clientePiso: [],
      clienteEscalera: [],
      clienteCodigoPostal: [],
      clienteCiudad: [],
      clienteProvincia: [],
      clienteImagenes: []
    })

    this.formularioCliente.get('clienteIdentificacion')?.setValidators([
      Validators.required, identificacionValidator(this.formularioCliente.get('tipoDocumento')!)]);
  }

  codigo: string = '';
  nombre: string = '';
  apellido1: string = '';
  apellido2: string = '';
  identificacion: string = '';
  fechaNacimiento: Date = new Date;
  calle: string = '';
  portal: string = '';
  piso: string = '';
  escalera: string = '';
  codigoPostal: number = 0;
  ciudad: string = '';
  provincia: string = '';

  abrirConfirmacion () {
    if (this.formularioCliente.valid) {
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
}

export function identificacionValidator(tipoDocumentoControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const tipoDocumento = tipoDocumentoControl.value;

    if (!value || typeof value !== 'string') {
      return { identificacionInvalida: true };
    }

    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const pasaporteRegex = /^[A-Z0-9]{6,9}$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    let esValido = false;

    switch (tipoDocumento) {
      case 'dni':
        if (dniRegex.test(value)) {
          esValido = validarLetraDNI(value);
        }
        break;
      case 'pasaporte':
        esValido = pasaporteRegex.test(value);
        break;
      case 'nie':
        if (nieRegex.test(value)) {
          esValido = validarNIE(value);
        }
        break;
      default:
        return { identificacionInvalida: true };    
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
    return esValido ? null : { identificacionInvalida: true };
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
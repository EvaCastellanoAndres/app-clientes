import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../Service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';

import { VentanaConfirmarComponent } from '../ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-crear',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})

export class CrearComponent implements OnInit{

  formularioCliente: FormGroup;
  editMode: boolean = false;
  clienteId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    public confirma: MatDialog,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formularioCliente = this.fb.group({
      clienteCodigo: ['', [Validators.required]],
      clienteNombre: ['', [requeridoValidator(), nombreValidator()]],
      clienteApellido1: ['', [requeridoValidator(), nombreValidator()]],
      clienteApellido2: [],
      tipoDocumento: ['dni'],
      clienteIdentificacion: [''],
      clienteFechaNacimiento: ['', [edadValidator()]],
      /*direcciones: this.fb.array([]),*/
      clienteCalle: ['', [Validators.required]],
      clientePortal: ['', [Validators.required]],
      clientePiso: [],
      clienteEscalera: [],
      clienteCodigoPostal: ['', [Validators.required]],
      clienteCiudad: ['', [requeridoValidator(), nombreValidator()]],
      clienteProvincia: ['', [requeridoValidator(), nombreValidator()]],
      clienteImagenes: this.fb.array([this.fb.control(null)])
    })

    this.formularioCliente.get('clienteIdentificacion')?.setValidators([
      Validators.required, identificacionValidator(this.formularioCliente.get('tipoDocumento')!)]);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.formularioCliente.patchValue(params);
        this.clienteId = params['id'];
        this.editMode = true;
      }
    });
  }

  /*get direcciones(): FormArray {
    return this.formularioCliente.get('direcciones') as FormArray;
  }

  agregarDireccion() {
    const direccionForm = this.fb.group({
      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      piso: [],
      escalera: [],
      codigoPostal: ['', [Validators.required]],
      ciudad: ['', [requeridoValidator(), nombreValidator()]],
      provincia: ['', [requeridoValidator(), nombreValidator()]]
    });

    this.direcciones.push(direccionForm);
  }

  eliminarDireccion(index: number) {
    this.direcciones.removeAt(index);
  }*/

  get clienteImagenes(): FormArray {
    return this.formularioCliente.get('clienteImagenes') as FormArray;
  }

  agregarInput(): void {
    if (this.clienteImagenes.length < 4) {
      this.clienteImagenes.push(this.fb.control(null));
    }
  }

  manejarCambioArchivo(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.clienteImagenes.at(index).setValue(file);
      if (this.clienteImagenes.length < 4 && index === this.clienteImagenes.length - 1) {
        this.agregarInput();
      }
    }
  }

  abrirConfirmacion () {
    /*const dialogRef = this.confirma.open(VentanaConfirmarComponent, {
      data: this.formularioCliente.value
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarCliente(result);
      }
    });*/

    if (this.formularioCliente.valid) {
      this.confirma.open(VentanaConfirmarComponent, { 
      data: {codigo: this.formularioCliente.value.clienteCodigo,
             nombre: this.formularioCliente.value.clienteNombre,
             apellido1: this.formularioCliente.value.clienteApellido1,
             apellido2: this.formularioCliente.value.clienteApellido2,
             identificacion: this.formularioCliente.value.clienteIdentificacion,
             fechaNacimiento: this.formularioCliente.value.clienteFechaNacimiento,
             calle: this.formularioCliente.value.clienteCalle,
             portal: this.formularioCliente.value.clientePortal,
             piso: this.formularioCliente.value.clientePiso,
             escalera: this.formularioCliente.value.clienteEscalera,
             codigoPostal: this.formularioCliente.value.clienteCodigoPostal,
             ciudad: this.formularioCliente.value.clienteCiudad,
             provincia: this.formularioCliente.value.clienteProvincia,
             imagenes: this.formularioCliente.value.clienteImagenes
            }
      });
    }
  }
  /*guardarCliente(cliente: any) {
    if (this.formularioCliente.valid) {
      if (this.editMode && this.clienteId) {
        this.clienteService.actualizarCliente(this.clienteId, cliente).subscribe(() => {
          this.router.navigate(['/inicio']);
        });
      } else {
        this.clienteService.crearCliente(cliente).subscribe(() => {
          this.router.navigate(['/inicio']); // Redirigir después de crear
        });
      }
    }
  }*/
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
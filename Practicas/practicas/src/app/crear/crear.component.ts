import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClienteService } from '../Service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of,  timer } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

import { VentanaConfirmarComponent } from '../ventana-confirmar/ventana-confirmar.component';
import { VentanaPermisosComponent } from '../ventana-permisos/ventana-permisos.component';

@Component({
  selector: 'app-crear',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})

export class CrearComponent{

  @ViewChild('fileInput') fileInputs: any;

  formularioCliente: FormGroup;
  clienteId: number | null = null;
  imagenesPrevisualizadas: string[] = [];
  permisosOtorgados: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formularioCliente = this.fb.group({
      codigo: ['', [requeridoValidator()], [codigoExistenteValidator(this.clienteService)]],
      nombre: ['', [requeridoValidator(), nombreValidator()]],
      apellido1: ['', [requeridoValidator(), nombreValidator()]],
      apellido2: [],
      tipoDocumento: ['dni'],
      identificacion: ['', [], [identificacionExistenteValidator(this.clienteService)]],
      fechaNacimiento: ['', [edadValidator()]],
      /*direcciones: this.fb.array([]),*/
      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      piso: [],
      escalera: [],
      codigoPostal: ['', [Validators.required]],
      ciudad: ['', [requeridoValidator(), nombreValidator()]],
      provincia: ['', [requeridoValidator(), nombreValidator()]],
      imagenes: this.fb.array([this.fb.control(null)])
    });

    this.formularioCliente.get('identificacion')?.setValidators([
      Validators.required, identificacionValidator(this.formularioCliente.get('tipoDocumento')!)]);
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

  get imagenes(): FormArray {
    return this.formularioCliente.get('imagenes') as FormArray;
  }

  agregarInput(): void {
    if (this.imagenes.length < 4) {
      this.imagenes.push(this.fb.control(null));
    }
  }

  /* solicitarPermisoGaleria(index: number): void {
    if (!this.permisosOtorgados) {
      const dialogRef = this.dialog.open(VentanaPermisosComponent, {
        data: {
          mensaje: '¿Permitir acceso a la galería para seleccionar una imagen?',
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.permisosOtorgados = true;
          this.fileInputs.toArray()[index].nativeElement.click(); // Acceder al input correspondiente
        }
      });
    } else {
      this.fileInputs.toArray()[index].nativeElement.click(); // Acceder al input correspondiente
    }
  }
 */

  solicitarPermisoGaleria(index: number) {
    if (!this.permisosOtorgados) {
      const dialogRef = this.dialog.open(VentanaPermisosComponent, {
        data: {
          mensaje: '¿Permitir acceso a la galería para seleccionar una imagen?',
        }
      });
      dialogRef.afterClosed().subscribe(permitido => {
        if (permitido) {
          this.permisosOtorgados = true;
          this.abrirSelectorImagen(index);
        }
      });
    } else {
      this.abrirSelectorImagen(index);
    }
  }

  abrirSelectorImagen(index: number) {
    const fileInputs = document.querySelectorAll<HTMLInputElement>("#imagenes");
    if (fileInputs[index]) {
      fileInputs[index].click();
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

  /* manejarCambioArchivo(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenes.at(index).setValue(file);
      if (this.imagenes.length < 4 && index === this.imagenes.length - 1) {
        this.agregarInput();
      }
    }
  } */

  abrirConfirmacion () {
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

export function codigoExistenteValidator(clienteService: ClienteService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const codigo = control.value;
    if (!codigo) {
      return of(null);
    }
    return timer(1000).pipe(
      switchMap(() =>
        clienteService.verificarCodigoExistente(codigo).pipe(
          map((existe) => (existe ? { codigoExistente: true } : null)),
          catchError(() => of(null))
        )
      )
    );
  };
}

export function identificacionExistenteValidator(clienteService: ClienteService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const identificacion = control.value;
    if (!identificacion) {
      return of(null);
    }
    return timer(1000).pipe(
      switchMap(() =>
        clienteService.verificarIdentificacionExistente(identificacion).pipe(
          map((existe) => (existe ? { identificacionExistente: true } : null)),
          catchError(() => of(null))
        )
      )
    );
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
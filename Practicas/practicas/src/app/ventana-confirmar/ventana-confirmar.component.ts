import { Component, Inject, OnInit } from '@angular/core';
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
  numero: string;
  piso: string;
  escalera: string;
  codigoPostal: number;
  ciudad: string;
  provincia: string;
  imagenes: (File | string)[];
  [key: string]: any;
}
@Component({
  selector: 'app-ventana-confirmar',
  imports: [ MatDialogModule, CommonModule ],
  templateUrl: './ventana-confirmar.component.html',
  styleUrl: './ventana-confirmar.component.scss'
})
export class VentanaConfirmarComponent implements OnInit {
  mensajeError: string = '';
  clienteId: number | null = null;
  imagenesPreview: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<VentanaConfirmarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosVentana,
    private clienteService: ClienteService,
    private router: Router
  ){}

  ngOnInit() {
    if (this.data.imagenes) {
      this.generarPrevisualizaciones();
    }
  }

  generarPrevisualizaciones() {
    this.imagenesPreview = [];
  
    if (!Array.isArray(this.data.imagenes)) {
      console.error("❌ Error: `this.data.imagenes` no es un array.", this.data.imagenes);
      return;
    }
  
    this.data.imagenes.forEach((imagen: any) => {
      if (imagen instanceof File) {
        this.imagenesPreview.push(URL.createObjectURL(imagen));
      } else if (typeof imagen === "string") {
        this.imagenesPreview.push(imagen);
      } else {
        console.error("❌ Tipo de dato inesperado en `this.data.imagenes`:", imagen);
      }
    });
  }
  
  async uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      console.log("📤 Subiendo imagen al backend:", file.name);
      const response = await fetch('https://app-clientes-4hsr.onrender.com/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // Leer el error como texto
        console.error("❌ Error en la subida (texto):", errorData);
        return null; // Devuelve null si hay un error
      }
  
      const data = await response.json();
      console.log("✅ Imagen subida con éxito:", data.url);
      return data.url; // Devuelve la URL de la imagen subida
    } catch (error) {
      console.error("❌ Error al subir la imagen (fetch error):", error);
      return null; // Devuelve null si hay un error
    }
  }

  async confirmar() {
    const formData = new FormData();

    Object.keys(this.data).forEach(key => {
      if (key !== 'imagenes') {
        formData.append(key, this.data[key]);
      }
    });

    if (this.data.imagenes && this.data.imagenes.length > 0) {
      this.data.imagenes.forEach((imagen, index) => {
        if (imagen instanceof File) {
          formData.append('imagenes', imagen);
        }
      });
    }

    if (this.data.id) {
      this.clienteService.actualizarCliente(this.data.id, formData).subscribe(() => {
        this.dialogRef.close(true);
        this.router.navigate(['/inicio']);
      });
    } else {
      this.clienteService.crearCliente(formData).subscribe(
        response => {
          console.log("✅ Cliente guardado con éxito:", response);
          this.dialogRef.close();
          this.router.navigate(['/inicio']);
        },
        error => {
          console.error("❌ Error al guardar el cliente:", error);
        }
      );
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

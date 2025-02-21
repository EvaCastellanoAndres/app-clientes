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
  editMode: boolean = false;
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
        // Si es un archivo, creamos una URL temporal
        this.imagenesPreview.push(URL.createObjectURL(imagen));
      } else if (typeof imagen === "string") {
        // Si ya es una URL (por ejemplo, recuperada de la base de datos), la usamos directamente
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
    console.log("Confirmar presionado, enviando datos:", this.data);
  
    // Verifica si hay imágenes para subir
    if (this.data.imagenes && this.data.imagenes.length > 0) {
      const urls: string[] = [];
  
      // Filtra solo las imágenes que son instancias de File
      const imagenesFiles = this.data.imagenes.filter((imagen): imagen is File => imagen instanceof File);
  
      // Sube cada imagen a través del backend
      for (const imagen of imagenesFiles) {
        const url = await this.uploadImage(imagen);
        if (url) {
          urls.push(url); // Agrega la URL de la imagen subida
        }
      }
  
      // Combina las URLs de las imágenes subidas con las que ya son URLs (si las hay)
      const todasLasImagenes = [...urls, ...this.data.imagenes.filter(imagen => typeof imagen === "string")];
  
      // Actualiza el objeto data con las URLs de las imágenes
      this.data = { ...this.data, imagenes: todasLasImagenes };
    }
  
    console.log("📤 Datos enviados al backend:", this.data);
    // Guarda los datos del cliente
    this.clienteService.crearCliente(this.data).subscribe(
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

  /* async subirImagenes(imagenes: File[]): Promise<string[]> {
    const urls: string[] = [];
    const CLOUDINARY_URL = "https://api.cloudinary.com/dmhemvly5/image/upload"; // ⚠️ Reemplaza "tu_cloud_name" con tu Cloud Name
    const UPLOAD_PRESET = "evamaria"; // ⚠️ Reemplázalo con tu preset en Cloudinary
  
    for (const imagen of imagenes) {
      const formData = new FormData();
      formData.append("file", imagen);
      formData.append("upload_preset", UPLOAD_PRESET); 
  
      try {
        console.log("📤 Subiendo imagen a Cloudinary:", imagen.name);
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData
        });

        console.log("📡 Respuesta de Cloudinary:", response);
  
        if (!response.ok) {
          const errorData = await response.text(); // 🔹 Leer error como texto
          console.error("❌ Error en la subida (texto):", errorData);
          continue;
        }
  
        const data = await response.json();
        console.log("✅ Imagen subida con éxito:", data.secure_url);
        urls.push(data.secure_url);
      } catch (error) {
        console.error("❌ Error al subir la imagen (fetch error):", error);
      }
    }
  
  
    return urls;
  }


    
  async confirmar() {
    console.log("Confirmar presionado, enviando datos:", this.data);
  
    if (this.data.imagenes && this.data.imagenes.length > 0) {
      const urls = await this.subirImagenes(this.data.imagenes as File[]); // 👈 Aseguramos que son archivos
      this.data = { ...this.data, imagenes: urls }; // 👈 Asignamos correctamente las URLs
    }
  
    this.clienteService.crearCliente(this.data).subscribe(
      response => {
        console.log("✅ Cliente guardado con éxito:", response);
        this.dialogRef.close();
        this.router.navigate(['/inicio']);
      },
      error => {
        console.error("❌ Error al guardar el cliente:", error);
      }
    );
  } */
  
  /* async confirmar() {
    try {
      // Filtra las imágenes que son instancias de File
      const imagenesFiles = this.data.imagenes.filter((imagen): imagen is File => imagen instanceof File);
  
      // Sube las imágenes a Cloudinary
      const imagenesUrls = await this.subirImagenes(imagenesFiles);
  
      // Combina las URLs de las imágenes con las que ya pueden ser URLs (si las hay)
      const todasLasImagenes = [...imagenesUrls, ...this.data.imagenes.filter(imagen => typeof imagen === "string")];
  
      // Actualiza el objeto data con las URLs de las imágenes
      const datosActualizados = { ...this.data, imagenes: todasLasImagenes };
  
      if (this.data.id) {
        console.log("Editando cliente con ID:", this.data.id);
        this.clienteService.actualizarCliente(this.data.id, datosActualizados).subscribe(() => {
          this.dialogRef.close(true);
          this.router.navigate(['/inicio']);
        });
      } else {
        console.log("Creando nuevo cliente:", datosActualizados);
        this.clienteService.crearCliente(datosActualizados).subscribe(() => {
          this.dialogRef.close(true);
          this.router.navigate(['/inicio']);
        });
      }
    } catch (error) {
      console.error("❌ Error al subir las imágenes o guardar el cliente:", error);
      this.mensajeError = "Hubo un error al guardar el cliente. Por favor, inténtalo de nuevo.";
    }
  } */

 /*  confirmar () {
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
  }
 */
  cancelar() {
    this.dialogRef.close();
  }
}

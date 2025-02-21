import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const multerOptions: MulterOptions = {
  storage: multer.memoryStorage(), // Guardar archivos en memoria para enviarlos a Cloudinary
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
};

@Controller('client')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly uploadService: UploadService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('imagenes')) // Se espera que los archivos vengan en el campo "imagenes"
  async createClient(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() clientData: any,
  ) {
    // Log para verificar que se reciben los archivos
    console.log("📂 Archivos recibidos en interceptor:", files && files.length ? files.length : "No se enviaron archivos");

    // Variable para acumular las URLs generadas por Cloudinary
    let imageUrls: string[] = [];

    // Si se recibieron archivos, procesarlos
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          // Se llama al servicio de Cloudinary para subir cada archivo
          const result = await this.cloudinaryService.uploadImage(file);
          console.log("📸 URL subida a Cloudinary:", result.url);

          imageUrls.push(result.url);
        } catch (error) {
          console.error("Error subiendo imagen a Cloudinary:", error);
        }
      }
    }

    console.log("✅ URLs de imágenes generadas:", imageUrls);

    // Agregar las URLs de las imágenes al objeto de datos del cliente
    // Si por algún motivo ya existe la propiedad "imagenes", se puede concatenar o reemplazar según tu lógica
    clientData.imagenes = imageUrls;

    console.log("📡 Datos que se enviarán a la BD:", clientData);

    // Crear el cliente usando el servicio correspondiente
    const createdClient = await this.clientsService.create(clientData,imageUrls);
    console.log("💾 Cliente guardado en BD:", createdClient);
    return createdClient;
  }


  /* @Post()
  @UseInterceptors(
    FilesInterceptor('imagenes', 4, {
      // Usamos Multer para manejar la subida de imágenes
      storage: diskStorage({
        destination: 'data/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const isExtnameValid = fileTypes.test(
          extname(file.originalname).toLowerCase());
        const isMimetypeValid = fileTypes.test(file.mimetype);

        if (isExtnameValid && isMimetypeValid) {
          return cb(null, true);
        } else {
          return cb(
            new Error('Solo se permiten imágenes (JPG, JPEG, PNG).'),
            false,
          );
        }
      },
    }),
  ) 
  async create(
    @Body(new ValidationPipe({ transform: true })) createClientDto: CreateClientDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log("Archivos subidos:", files?.map(file => file.originalname) || "No se enviaron archivos");
    try {
      const imageUrls = files?.length 
        ? await Promise.all(files.map(async (file) => await this.uploadService.uploadImage(file)))
        : [];
        console.log("URLs de imágenes generadas:", imageUrls);
      const clientData = { ...createClientDto, imagenes: imageUrls };
      console.log("Datos que se enviarán a la BD:", JSON.stringify(clientData, null, 2));
  
      const client = await this.clientsService.create(clientData, imageUrls);
  
      console.log("Cliente realmente guardado en BD:", client);
  
      return client;
    } catch (error) {
      console.error("Error en create:", error);
      throw new BadRequestException('Error al crear el cliente: ' + error.message);
    }
  }
  */

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const client = await this.clientsService.findOne(id); // Busca el cliente
    if (!client) {
      throw new Error(`Cliente con ID ${id} no encontrado.`);
    }
    return client;
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: diskStorage({
        destination: 'data/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const isExtnameValid = fileTypes.test(
          extname(file.originalname).toLowerCase(),
        );
        const isMimetypeValid = fileTypes.test(file.mimetype);

        if (isExtnameValid && isMimetypeValid) {
          return cb(null, true);
        } else {
          return cb(
            new Error('Solo se permiten imágenes (JPG, JPEG, PNG).'),
            false,
          );
        }
      },
    }),
  )
  async update(
    @Param('id') id: string, // <-- Cambiar a string
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const numericId = Number(id); // <-- Convertir manualmente

    if (isNaN(numericId)) {
      throw new BadRequestException('ID inválido');
    }

    const imageUrls = files?.length
      ? await Promise.all(
          files.map(async (file) => await this.uploadService.uploadImage(file)),
        )
      : [];

    return this.clientsService.update(numericId, updateClientDto, imageUrls);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clientsService.remove(+id);
  }
}

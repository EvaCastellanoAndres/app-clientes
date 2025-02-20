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
import { ValidationPipe } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from '../upload/upload.service';

@Controller('client')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 4, {
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
  async create(
    @Body(new ValidationPipe({ transform: true })) createClientDto: CreateClientDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const imageUrls = files?.length 
        ? await Promise.all(files.map(async (file) => await this.uploadService.uploadImage(file)))
        : [];
  
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
      ? await Promise.all(files.map(async (file) => await this.uploadService.uploadImage(file)))
      : [];
  
    return this.clientsService.update(numericId, updateClientDto, imageUrls);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clientsService.remove(+id);
  }
}

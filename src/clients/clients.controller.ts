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
import { UpdateClientDto } from './dto/update-client.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
@UseInterceptors(FilesInterceptor('imagenes', 4)) 
async createClient(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() clientData: any,
) {

  let imageUrls: (string | null)[] = [];

  if (files && files.length > 0) {
    imageUrls = await Promise.all(files.map(async (file) => {
      try {
        const result = await this.cloudinaryService.uploadImage(file);
        return result.url;
      } catch (error) {
        console.error('Error subiendo imagen a Cloudinary:', error);
        return null;
      }
    }));
  }

  const validImageUrls = imageUrls.filter((url): url is string => url !== null);


  const datosCompletos = {
    ...clientData,
    imagenes: validImageUrls,
  };

  const createdClient = await this.clientsService.create(datosCompletos, validImageUrls);
  return createdClient;
}
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const client = await this.clientsService.findOne(id);
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
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const numericId = Number(id);

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

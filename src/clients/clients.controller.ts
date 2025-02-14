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
  BadRequestException 
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { extname as pathExtname } from 'path';
import { ValidationPipe } from '@nestjs/common';

@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 4, {
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
        const extname = fileTypes.test(
          pathExtname(file.originalname).toLowerCase(),
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
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
    @Body(new ValidationPipe({ transform: true }))
    createClientDto: CreateClientDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const client = await this.clientsService.create(createClientDto, files);
      return client;
    } catch (error) {
      return { message: error.message };
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
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
@UseInterceptors(
  FilesInterceptor('images', 4, {
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
      const extname = fileTypes.test(
        pathExtname(file.originalname).toLowerCase(),
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
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
  @UploadedFiles() files: Express.Multer.File[],
) {
  return this.clientsService.update(+id, updateClientDto, files);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}

import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      return uploadResult;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return { error: 'No se pudo subir la imagen a Cloudinary' };
    }
  }
}

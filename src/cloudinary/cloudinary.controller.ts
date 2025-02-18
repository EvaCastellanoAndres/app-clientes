import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log(file); // Verifica si el archivo llega correctamente
  try {
    const result = await this.cloudinaryService.uploadImage(file);
    return result;
  } catch (error) {
    return { error: 'Error uploading image', details: error };
  }
}

}

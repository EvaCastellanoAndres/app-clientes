import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
 
@Controller('cloudinary')
export class CloudinaryController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const CLOUDINARY_URL = process.env.CLOUDINARY_URL || 'https://api.cloudinary.com/dmhemvly5/image/upload';
    const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'evamaria';
 
    const formData = new FormData();
    formData.append('file', file.buffer.toString('base64')); // Envía el archivo en base64
    formData.append('upload_preset', UPLOAD_PRESET);
 
    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { url: response.data.secure_url };
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      throw new Error('Error al subir la imagen');
    }
  }
}
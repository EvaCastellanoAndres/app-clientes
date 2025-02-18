import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dmhemvly5',
      api_key: '265739886399886',
      api_secret: '7ldmOLdeE5gjJgUSkq5rtINPeCY',
    });
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'clientes/', // Carpeta donde se guardarán las imágenes
      });
      return result;
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
  }
}

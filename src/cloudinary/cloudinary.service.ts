import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dmhemvly5', // Sustituye con tu cloud_name
      api_key: '265739886399886', // Sustituye con tu api_key
      api_secret: '7ldmOLdeE5gjJgUSkq5rtINPeCY', // Sustituye con tu api_secret
    });
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'client/',
        use_filename: true,
        unique_filename: false,
      });
      return result;
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
  }
}

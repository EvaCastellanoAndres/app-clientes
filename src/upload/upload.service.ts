import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url); // Retorna la URL de la imagen
        })
        .end(file.buffer);
    });
  }
}

import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uniqueFilename = `client_${Date.now()}_${Math.round(Math.random() * 1e9)}`;
  
      cloudinary.uploader.upload_stream(
        { public_id: uniqueFilename, folder: "client" },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      ).end(file.buffer);
    });
  }    
}

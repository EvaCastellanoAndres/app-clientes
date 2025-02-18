import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      cloudinaryV2.uploader.upload(file.path, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
}

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const uniqueFilename = `client_${Date.now()}_${Math.round(Math.random() * 1e9)}`;

    cloudinary.uploader.upload_stream(
      { public_id: uniqueFilename, folder: "client" }, // 👈 Asegurar nombres únicos
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Result is undefined')); // Add this check
        resolve({ url: result.secure_url });
      }
    ).end(file.buffer);
  });

}
}

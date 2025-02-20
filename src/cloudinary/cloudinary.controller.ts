import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('cloudinary')
export class CloudinaryController {
  @Post('upload')
  async uploadToCloudinary(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const cloudinaryUrl = 'https://api.cloudinary.com/dmhemvly5/image/upload';
      const response = await axios.post(cloudinaryUrl, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: 'Internal Server Error' });
    }
  }
}

/*import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadedImage = await this.cloudinaryService.uploadImage(file);
    return { imageUrl: uploadedImage.secure_url };
  }
}
*/

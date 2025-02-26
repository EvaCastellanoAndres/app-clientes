import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { UploadModule } from '../upload/upload.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [UploadModule],
  controllers: [ClientsController],
  providers: [ClientsService, CloudinaryService],
})
export class ClientsModule {}

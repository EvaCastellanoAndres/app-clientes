import { Module } from '@nestjs/common';
import { UploadService } from './upload.service'; // Asegúrate de importar el servicio

@Module({
  providers: [UploadService],
  exports: [UploadService], // Exporta el servicio para que otros módulos puedan usarlo
})
export class UploadModule {}

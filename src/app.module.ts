import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // Almacena en memoria para enviar a Cloudinary
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'process.env.postgresql://evamaria:002VhqEBC2kfvFHdQSeftQn6rPtURYwb@dpg-cumt2852ng1s739q27l0-a.frankfurt-postgres.render.com/clientes_n94x',
      entities: [],
      synchronize: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    ClientsModule,
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'data', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController,CloudinaryController],
  providers: [AppService,CloudinaryService],
})
export class AppModule {}

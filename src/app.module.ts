import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
      serveRoot: 'data/uploads', 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

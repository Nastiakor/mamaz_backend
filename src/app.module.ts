import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'mamaz_yoga',
          entities: ['**/entity/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
           }),
        UsersModule,
          ],
      controllers: [AppController],
      providers: [AppService],
})
export class AppModule {}

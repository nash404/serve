import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './socket/socket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointModule } from './point.module';
import { Point } from './entity/point.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PointModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'dpg-clbkr2ft6quc738eogf0-a.frankfurt-postgres.render.com',
        port: 5342,
        username: 'points_gj4w_user',
        password: '7qKEeuQEq4TbqMoF3l5LTyrrqgvPL0cv',
        database: 'points_gj4w',
        entities: [Point],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

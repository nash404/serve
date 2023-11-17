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
        host: 'roundhouse.proxy.rlwy.net',
        port: 16022,
        username: 'postgres',
        password: '6B4ggF**fED4d6FGf311CC4BGcF4DD*1',
        database: 'railway',
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

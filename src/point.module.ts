import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketService } from './socket/socket.service';

import { Point } from './entity/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  providers: [SocketService],
  controllers: [],
})
export class PointModule {}

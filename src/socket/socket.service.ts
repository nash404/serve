import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from 'src/entity/point.entity';
import { CreatePointDto } from './point.dto';
import { SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  private nameOfCron: string = '';
  addCronJob(name: string, client) {
    const job = new CronJob(CronExpression.EVERY_10_SECONDS, async () => {
      let points = await this.pointRepository.find();
      points.map(async (item) => {
        if (
          new Date().getTime() - new Date(Number(item.date)).getTime() >=
          60000
        ) {
          await this.pointRepository.delete(item.id);
        }
        client.server.emit('getPoint', await this.pointRepository.find());
      });
    });
    if (this.nameOfCron === name) {
      this.schedulerRegistry.deleteCronJob(name);
      let saveName = (name + Math.random() * 1000).toString();
      this.schedulerRegistry.addCronJob(saveName, job);
      this.nameOfCron = saveName;
    } else {
      this.schedulerRegistry.addCronJob(name, job);
    }

    job.start();
  }

  @SubscribeMessage('path')
  async handleEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    this.addCronJob(('checkPoint' + Math.random() * 1000).toString(), client);
    let result = {
      id: 0,
      date: new Date().getTime().toString(),
      x: dto.points[0],
      y: dto.points[1],
    };
    await this.pointRepository.save(result);

    const newPoints = await this.pointRepository.find();
    client.server.emit('getPoint', newPoints);
  }
  async handleConnection(@ConnectedSocket() client: any) {
    const startPoints = await this.pointRepository.find();
    client.server.emit('getPoint', startPoints);
  }
}

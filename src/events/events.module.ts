import { Module } from '@nestjs/common';
import { GateWayModule } from 'src/gateway/gateway.module';
import { GroupEvent } from './groups/group.event';
import { RedisModule } from 'src/custom-redis/custom-redis.module';

@Module({
  imports: [RedisModule, GateWayModule],
  providers: [GroupEvent],
})
export class EventModule {}

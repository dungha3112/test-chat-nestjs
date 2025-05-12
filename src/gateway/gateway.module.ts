import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { RedisModule } from 'src/custom-redis/custom-redis.module';

@Module({
  imports: [RedisModule],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class GateWayModule {}

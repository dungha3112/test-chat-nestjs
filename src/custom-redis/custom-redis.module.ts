import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { Services } from 'src/utils/constants';
import { SocketRedisService } from './services/socket-redis.service';

const redisProvider = {
  provide: Services.REDIS_CLIENT,
  useFactory: () => {
    console.log(
      `---> Redis server is running on: http://${process.env.REDIS_HOST}:${Number(process.env.REDIS_PORT)}`,
    );
    return new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      // tls: {},
    });
  },
};

@Module({
  providers: [
    redisProvider,
    {
      provide: Services.REDIS_SOCKET,
      useClass: SocketRedisService,
    },
  ],
  exports: [
    redisProvider,
    {
      provide: Services.REDIS_SOCKET,
      useClass: SocketRedisService,
    },
  ],
})
export class RedisModule {}

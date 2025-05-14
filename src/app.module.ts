import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CustomJwtModule } from './custom-jwt/custom-jwt.module';
import { DatabaseModule } from './database/database.module';
import { GateWayModule } from './gateway/gateway.module';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './events/events.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CustomJwtModule,
    GroupModule,

    GateWayModule,
    EventEmitterModule.forRoot(),
    EventModule,
    ConversationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

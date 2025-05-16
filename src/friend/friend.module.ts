import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Services } from 'src/utils/constants';
import { Friend, FriendRequest } from 'src/utils/typeorm';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendController } from './controllers/friend.controller';
import { FriendReuestService } from './services/friend-request.service';
import { AuthMiddleware } from 'src/utils/middlewares';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';
import { FriendService } from './services/friend.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest]),
    UserModule,
    CustomJwtModule,
  ],
  controllers: [FriendController, FriendRequestController],
  providers: [
    { provide: Services.FRIEND_REQUEST, useClass: FriendReuestService },

    { provide: Services.FRIEND, useClass: FriendService },
  ],
})
export class FriendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(FriendController, FriendRequestController);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Services } from 'src/utils/constants';
import { Friend } from 'src/utils/typeorm';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendController } from './controllers/friend.controller';
import { FriendReuestService } from './services/friend-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UserModule],
  controllers: [FriendController, FriendRequestController],
  providers: [
    {
      provide: Services.FRIEND_REQUEST,
      useClass: FriendReuestService,
    },
  ],
})
export class FriendModule {}

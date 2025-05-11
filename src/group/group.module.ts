import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';
import { UserModule } from 'src/user/user.module';
import { Services } from 'src/utils/constants';
import { AuthMiddleware } from 'src/utils/middlewares';
import { Group, GroupMessage } from 'src/utils/typeorm';
import { GroupMessageController } from './controllers/group-message.controller';
import { GroupRecipientController } from './controllers/group-recipient.controller';
import { GroupController } from './controllers/group.controller';
import { GroupMiddleware } from './middlewares/group.middleware';
import { GroupMessageService } from './services/group-message.service';
import { GroupRecipientsService } from './services/group-recipients.service';
import { GroupService } from './services/group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMessage]),
    UserModule,
    CustomJwtModule,
  ],
  controllers: [
    GroupController,
    GroupRecipientController,
    GroupMessageController,
  ],
  providers: [
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },

    {
      provide: Services.GROUP_MESSAGE,
      useClass: GroupMessageService,
    },

    {
      provide: Services.GROUPS_RECIPIENTS,
      useClass: GroupRecipientsService,
    },
  ],

  exports: [
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },
  ],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('group');
    consumer.apply(GroupMiddleware).forRoutes('group/:id');
  }
}

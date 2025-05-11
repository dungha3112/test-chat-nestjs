import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage } from 'src/utils/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from 'src/utils/middlewares';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';
import { GroupMiddleware } from './middlewares/group.middleware';
import { GroupMessageController } from './controllers/group-message.controller';
import { GroupMessageService } from './services/group-message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMessage]),
    UserModule,
    CustomJwtModule,
  ],
  controllers: [GroupController, GroupMessageController],
  providers: [
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },

    {
      provide: Services.GROUP_MESSAGE,
      useClass: GroupMessageService,
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

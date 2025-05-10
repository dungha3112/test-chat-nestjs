import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/utils/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from 'src/utils/middlewares';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UserModule, CustomJwtModule],
  controllers: [GroupController],
  providers: [
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },
  ],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(GroupController);
  }
}

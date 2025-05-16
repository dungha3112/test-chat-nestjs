import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions, User } from 'src/utils/typeorm';
import { AuthMiddleware } from 'src/utils/middlewares';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sessions]),
    forwardRef(() => CustomJwtModule),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],

  exports: [
    {
      provide: Services.USER,
      useClass: UserService,
    },
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('user');
  }
}

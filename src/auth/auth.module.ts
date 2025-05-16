import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'src/utils/constants';
import { Sessions, User } from 'src/utils/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guards/LocalStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sessions]),
    UserModule,
    CustomJwtModule,
    // using to user login
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    //  using @Guard:  Local AuthGuard and this is validation @Body
    LocalStrategy,

    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}

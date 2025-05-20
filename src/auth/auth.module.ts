import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';
import { EmailModule } from 'src/email/email.module';
import { OtpModule } from 'src/otp/otp.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { UserModule } from 'src/user/user.module';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/LocalStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    CustomJwtModule,
    // using to user login
    PassportModule,
    OtpModule,
    EmailModule,

    SessionsModule,
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

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, CustomJwtModule],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}

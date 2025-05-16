import { forwardRef, Module } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';
import { Services } from 'src/utils/constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/JwtStrategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    JwtStrategy,
    {
      provide: Services.CUSTOM_JWT,
      useClass: CustomJwtService,
    },
  ],

  exports: [
    JwtStrategy,
    {
      provide: Services.CUSTOM_JWT,
      useClass: CustomJwtService,
    },
  ],
})
export class CustomJwtModule {}

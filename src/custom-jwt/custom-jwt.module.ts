import { Module } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';
import { Services } from 'src/utils/constants';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  providers: [
    {
      provide: Services.CUSTOM_JWT,
      useClass: CustomJwtService,
    },
  ],

  exports: [
    {
      provide: Services.CUSTOM_JWT,
      useClass: CustomJwtService,
    },
  ],
})
export class CustomJwtModule {}

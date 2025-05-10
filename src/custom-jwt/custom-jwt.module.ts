import { Module } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';
import { Services } from 'src/utils/constants';

@Module({
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

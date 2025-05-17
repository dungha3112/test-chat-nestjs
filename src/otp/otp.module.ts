import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otps } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Otps])],
  providers: [
    {
      provide: Services.OTP,
      useClass: OtpService,
    },
  ],
  exports: [{ provide: Services.OTP, useClass: OtpService }],
})
export class OtpModule {}

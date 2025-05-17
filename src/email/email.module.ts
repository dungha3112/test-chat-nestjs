import { Module } from '@nestjs/common';
import { EmailService } from './emai.service';
import { Services } from 'src/utils/constants';

@Module({
  providers: [{ provide: Services.EMAIL, useClass: EmailService }],
  exports: [{ provide: Services.EMAIL, useClass: EmailService }],
})
export class EmailModule {}

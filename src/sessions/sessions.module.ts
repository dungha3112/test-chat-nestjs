import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions])],
  providers: [
    {
      provide: Services.SESSION,
      useClass: SessionsService,
    },
  ],

  exports: [
    {
      provide: Services.SESSION,
      useClass: SessionsService,
    },
  ],
})
export class SessionsModule {}

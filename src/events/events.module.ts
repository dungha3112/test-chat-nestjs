import { Module } from '@nestjs/common';
import { GateWayModule } from 'src/gateway/gateway.module';
import { GroupRecipientEvent } from './groups/group-recipient.event';
import { GroupEvent } from './groups/group.event';

@Module({
  imports: [GateWayModule],
  providers: [GroupEvent, GroupRecipientEvent],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { GateWayModule } from 'src/gateway/gateway.module';
import { GroupRecipientEvent } from './groups/group-recipient.event';
import { GroupEvent } from './groups/group.event';
import { ConversationEvent } from './conversations/conversation.event';
import { ConversationMessageEvent } from './conversations/conversation-message.event';

@Module({
  imports: [GateWayModule],
  providers: [
    GroupEvent,
    GroupRecipientEvent,
    ConversationEvent,
    ConversationMessageEvent,
  ],
})
export class EventModule {}

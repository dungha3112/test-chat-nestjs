import { Module } from '@nestjs/common';
import { GateWayModule } from 'src/gateway/gateway.module';
import { GroupRecipientEvent } from './groups/group-recipient.event';
import { GroupEvent } from './groups/group.event';
import { ConversationEvent } from './conversations/conversation.event';
import { ConversationMessageEvent } from './conversations/conversation-message.event';
import { ConversationModule } from 'src/conversation/conversation.module';
import { GroupMessageEvent } from './groups/group-message.event';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [GateWayModule, ConversationModule, GroupModule],
  providers: [
    GroupEvent,
    GroupMessageEvent,
    GroupRecipientEvent,
    ConversationEvent,
    ConversationMessageEvent,
  ],
})
export class EventModule {}

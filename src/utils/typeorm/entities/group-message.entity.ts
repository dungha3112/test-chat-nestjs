import { Entity, ManyToOne } from 'typeorm';
import { BaseMessage } from './base-message.entity';
import { Group } from './group.entity';

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group)
  group: Group;
}

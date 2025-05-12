import { ConversationMessage } from './conversation-message.entity';
import { Conversation } from './conversation.entity';
import { GroupMessage } from './group-message.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

const entities = [User, Group, GroupMessage, Conversation, ConversationMessage];

export default entities;

import { ConversationMessage } from './conversation-message.entity';
import { Conversation } from './conversation.entity';
import { FriendRequest } from './friend-request.entity';
import { Friend } from './friend.entity';
import { GroupMessage } from './group-message.entity';
import { Group } from './group.entity';
import { Otps } from './otp.entity';
import { Sessions } from './session.entity';
import { User } from './user.entity';

const entities = [
  User,
  Sessions,
  Group,
  GroupMessage,
  Conversation,
  ConversationMessage,
  Friend,
  FriendRequest,
  Otps,
];

export default entities;

export enum GroupEvents {
  GROUP_CREATE = 'group.create',
  GROUP_UPDATE = 'group.update',
  GROUP_OWNER_UPDATE = 'group.owner.update',
  GROUP_USER_LEAVE = 'group.user.leave',
}

export enum GroupRecipientEvents {
  GROUP_USER_ADD = 'group.user.add',
  GROUP_USER_REMOVE = 'group.user.remove',
}

export enum GroupMessageEvents {
  GROUP_MESSAGE_CREATE = 'group.message.create',
  GROUP_MESSAGE_EDIT = 'group.message.edit',
  GROUP_MESSAGE_DELETE = 'group.message.delete',
}

export enum ConversationEvents {
  CONVERSATION_CREATE = 'conversation.create',
}

export enum ConverMessageEvents {
  CONVER_MESSAGE_CREATE = 'conver.message.create',
  CONVER_MESSAGE_EDIT = 'conver.message.edit',
  CONVER_MESSAGE_DELETE = 'conver.message.delete',
}

export enum FriendEvents {
  USER_DELETE_FRIEND = 'user.delete.friend',
}

export enum FriendRequestEvents {
  FRIEND_REQUEST_CREATE = 'friend.request.create',
  FRIEND_REQUEST_ACCEPT = 'friend.request.accept',
  SENDER_DELETE_REQUEST = 'sender.delete.request',
  RECEIVER_REJECT_REQUEST = 'receiver.reject.request',
}

export enum ServerGroupEvent {
  GROUP_CREATE = 'group.create',
  GROUP_UPDATE = 'group.update',
  GROUP_OWNER_UPDATE = 'group.owner.update',
  GROUP_USER_LEAVE = 'group.user.leave',
}

export enum ServerGroupRecipientEvent {
  GROUP_USER_ADD = 'group.user.add',
  GROUP_USER_REMOVE = 'group.user.remove',
}

export enum ServerGroupMessageEvent {
  GROUP_MESSAGE_CREATE = 'group.message.create',
  GROUP_MESSAGE_EDIT = 'group.message.edit',
  GROUP_MESSAGE_DELETE = 'group.message.delete',
}

export enum ServerConversationEvent {
  CONVERSATION_CREATE = 'conversation.create',
}

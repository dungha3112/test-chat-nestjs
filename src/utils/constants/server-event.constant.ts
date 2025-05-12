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

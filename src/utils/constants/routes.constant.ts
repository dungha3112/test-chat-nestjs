export enum Routes {
  AUTH = 'auth',
  USER = 'user',

  GROUP = 'group',
  GROUP_MESSAGE = 'group/:id/message',
  GROUPS_RECIPIENTS = 'group/:id/recipient',

  CONVERSATION = 'conversation',
  CONVERSATION_MESSAGE = 'conversation/:id/message',

  FRIEND = 'friend',
  FRIEND_REQUEST = 'friend-request',
}

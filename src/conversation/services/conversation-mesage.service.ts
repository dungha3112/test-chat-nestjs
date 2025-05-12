import { Injectable } from '@nestjs/common';
import { IConversationMessageService } from 'src/utils/interfaces';
import { ConversationMessage } from 'src/utils/typeorm';
import {
  TCreateMessageParams,
  TCreateConversationResponse,
  TGetMessagesParams,
  TGetMessagesConversationResponse,
  TEditMessageParams,
  TDeleteMessageParams,
} from 'src/utils/types';

@Injectable()
export class ConversationMessageService implements IConversationMessageService {
  constructor() {}

  createMessageConver(
    params: TCreateMessageParams,
  ): Promise<TCreateConversationResponse> {
    throw new Error('Method not implemented.');
  }
  getMessagesByConversationId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesConversationResponse> {
    throw new Error('Method not implemented.');
  }
  editMessage(params: TEditMessageParams): Promise<ConversationMessage> {
    throw new Error('Method not implemented.');
  }
  deleteMessageGroupById(
    params: TDeleteMessageParams,
  ): Promise<ConversationMessage> {
    throw new Error('Method not implemented.');
  }
  saveMessageGroup(
    groupMessage: ConversationMessage,
  ): Promise<ConversationMessage> {
    throw new Error('Method not implemented.');
  }
}

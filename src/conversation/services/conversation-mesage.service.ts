import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';

import { ConversationMessage } from 'src/utils/typeorm';

import { Repository } from 'typeorm';
import { IConversationMessageService } from '../interfaces/conversation-message.interface';
import { IConversationService } from '../interfaces/conversation.interface';
import { IFriendService } from 'src/friend/interfaces/friend.interface';
import {
  TCreateMessageParams,
  TDeleteMessageParams,
  TEditMessageParams,
  TGetMessagesParams,
} from 'src/utils/types/message.type';
import {
  TCreateConversationResponse,
  TGetMessagesConversationResponse,
} from '../types/conversation-message.type';

@Injectable()
export class ConversationMessageService implements IConversationMessageService {
  constructor(
    @InjectRepository(ConversationMessage)
    private readonly _messageConverRepository: Repository<ConversationMessage>,

    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,

    @Inject(Services.FRIEND) private readonly _friendService: IFriendService,
  ) {}

  async createMessageConver(
    params: TCreateMessageParams,
  ): Promise<TCreateConversationResponse> {
    const { author, id, content } = params;

    const conversation =
      await this._conversationService.findConversationById(id);
    const { creator, recipient } = conversation;
    if (creator.id !== author.id && recipient.id !== author.id)
      throw new HttpException(
        'You are neither creator nor recipient of the conversation',
        HttpStatus.FORBIDDEN,
      );

    const isFriend = await this._friendService.isFriend(
      creator.id,
      recipient.id,
    );
    if (!isFriend)
      throw new HttpException(
        'Can not send message to strangers',
        HttpStatus.NOT_FOUND,
      );

    const newMessage = this._messageConverRepository.create({
      author,
      content,
      conversation,
    });
    const savedMessage = await this.saveMessageConver(newMessage);

    // update message conver
    conversation.lastMessageSent = savedMessage;
    const updateConversation =
      await this._conversationService.saveConversation(conversation);
    delete savedMessage.conversation;

    return {
      message: savedMessage,
      conversation: updateConversation,
    };
  }

  async getMessagesByConverId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesConversationResponse> {
    const { limit, id, page } = params;

    const [data, total] = await this._messageConverRepository
      .createQueryBuilder('message')
      .where('message.conversation.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .leftJoinAndSelect('message.author', 'author')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      conversationId: id,
      messages: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async editMessage(params: TEditMessageParams): Promise<ConversationMessage> {
    const { authorId, content, id, messageId } = params;

    const conversation =
      await this._conversationService.findConversationById(id);

    const messageDB = await this._messageConverRepository.findOne({
      where: { id: messageId, conversation: { id }, author: { id: authorId } },
      relations: ['author'],
    });
    if (!messageDB)
      throw new HttpException(
        'Message not found or you can not edit message',
        HttpStatus.BAD_REQUEST,
      );

    messageDB.content = content;
    const updateMessage = await this.saveMessageConver(messageDB);

    if (conversation.lastMessageSent.id === messageId) {
      await this._conversationService.updateLastMessageConver({
        id,
        lastMessageSent: updateMessage,
      });
    }

    return updateMessage;
  }

  async deleteMessageConverById(
    params: TDeleteMessageParams,
  ): Promise<ConversationMessage> {
    const { authorId, id, messageId } = params;
    const conversation =
      await this._conversationService.findConversationById(id);

    const message = await this._messageConverRepository.findOne({
      where: {
        id: messageId,
        author: { id: authorId },
      },
      relations: ['conversation', 'author'],
    });

    if (!message)
      throw new HttpException(
        'Message not found or you can not delete',
        HttpStatus.BAD_REQUEST,
      );

    if (conversation.lastMessageSent.id === message.id) {
      await this._messageConverRepository.delete({ id: messageId });
    } else {
      this.deleteLastMessage(conversation.id, message);
    }

    return message;
  }

  async deleteLastMessage(
    conversationId: string,
    message: ConversationMessage,
  ) {
    const converMessages = await this._messageConverRepository.find({
      where: { conversation: { id: conversationId } },
    });

    const size = converMessages.length;
    const SECOND_MESSAGE_INDEX = 1;

    if (size <= 1) {
      console.log(`last message sent conversation is deleted`);
      await this._conversationService.updateLastMessageConver({
        id: conversationId,
        lastMessageSent: null,
      });

      return await this._messageConverRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 conver message');

      const newLastMessage = converMessages[SECOND_MESSAGE_INDEX];
      await this._conversationService.updateLastMessageConver({
        id: conversationId,
        lastMessageSent: newLastMessage,
      });

      return await this._messageConverRepository.delete({ id: message.id });
    }
  }

  async saveMessageConver(
    converMessage: ConversationMessage,
  ): Promise<ConversationMessage> {
    return await this._messageConverRepository.save(converMessage);
  }
}

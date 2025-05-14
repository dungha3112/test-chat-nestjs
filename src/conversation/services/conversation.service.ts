import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Services } from 'src/utils/constants';
import { IConversationService, IUserService } from 'src/utils/interfaces';
import { Conversation, ConversationMessage } from 'src/utils/typeorm';
import {
  TAccessConversationParams,
  TConversationCreateParams,
  TUpdateLastMessageConverParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly _conversationRepository: Repository<Conversation>,

    @InjectRepository(ConversationMessage)
    private readonly _messageRepository: Repository<ConversationMessage>,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async userGetConversations(id: string): Promise<Conversation[]> {
    const conversations = await this._conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')

      .leftJoinAndSelect('lastMessageSent.author', 'author')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .getMany();

    return conversations;
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    if (!isUUID(id)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const conversation = await this._conversationRepository.findOne({
      where: { id },
      relations: [
        'creator',
        'recipient',
        'lastMessageSent',
        'lastMessageSent.author',
      ],
    });

    if (!conversation)
      throw new HttpException(
        'Conversation not found with id',
        HttpStatus.NOT_FOUND,
      );

    return conversation;
  }

  async createNewConversation(
    params: TConversationCreateParams,
  ): Promise<Conversation> {
    const { creator, message, recipientId } = params;

    if (!isUUID(recipientId)) {
      throw new HttpException(
        `Invalid UUID format recipientId`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (creator.id === recipientId) {
      throw new HttpException(
        'You can not create conversation with myself.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const recipient = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: recipientId },
    });
    if (!recipient) {
      throw new HttpException(
        'The recipient not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existsConversation = await this.isCreated(creator.id, recipient.id);
    if (existsConversation)
      throw new HttpException(
        'Conversation already exists',
        HttpStatus.BAD_REQUEST,
      );

    const newConversation = this._conversationRepository.create({
      creator,
      recipient,
    });
    const savedConversation = await this.saveConversation(newConversation);

    // create and save message
    const newMessage = this._messageRepository.create({
      content: message,
      author: creator,
      conversation: savedConversation,
    });
    const saveMessage = await this._messageRepository.save(newMessage);

    // update last message
    savedConversation.lastMessageSent = saveMessage;

    const updateConversation = await this.saveConversation(savedConversation);
    delete updateConversation.lastMessageSent.conversation;
    return updateConversation;
  }

  async isCreated(
    creatorId: string,
    recipientId: string,
  ): Promise<Conversation | undefined> {
    return await this._conversationRepository.findOne({
      where: [
        { creator: { id: creatorId }, recipient: { id: recipientId } },
        { creator: { id: recipientId }, recipient: { id: creatorId } },
      ],
    });
  }

  async updateLastMessageConver(params: TUpdateLastMessageConverParams) {
    const { id, lastMessageSent } = params;
    return await this._conversationRepository.update(id, { lastMessageSent });
  }

  async hasAccess(params: TAccessConversationParams): Promise<boolean> {
    const { id, userId } = params;

    const conversation = await this.findConversationById(id);

    return (
      (conversation.creator && conversation.creator.id === userId) ||
      (conversation.recipient && conversation.recipient.id === userId)
    );
  }

  async saveConversation(conversation: Conversation): Promise<Conversation> {
    return await this._conversationRepository.save(conversation);
  }
}

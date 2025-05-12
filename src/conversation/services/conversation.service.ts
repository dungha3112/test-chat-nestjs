import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';
import { IConversationService } from 'src/utils/interfaces/conversation.interface';
import { Conversation, ConversationMessage } from 'src/utils/typeorm';
import { TConversationCreateParams } from 'src/utils/types/conversation.type';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly _conversationRepository: Repository<Conversation>,

    @InjectRepository(ConversationMessage)
    private readonly _messageRepository: Repository<ConversationMessage>,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async createNewConversation(
    params: TConversationCreateParams,
  ): Promise<Conversation> {
    const { creator, message, recipientId } = params;

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

  async saveConversation(conversation: Conversation): Promise<Conversation> {
    return await this._conversationRepository.save(conversation);
  }
}

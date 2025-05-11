import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IGroupMessageService, IGroupService } from 'src/utils/interfaces';
import { Group, GroupMessage } from 'src/utils/typeorm';
import {
  TCreateGroupMessageResponse,
  TCreateMessageParams,
  TDeleteMessageParams,
  TEditMessageParams,
  TGetMessagesGroupResponse,
  TGetMessagesParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly _messageGroupRepository: Repository<GroupMessage>,

    @Inject(Services.GROUP) private readonly _groupService: IGroupService,
  ) {}

  async createMessageGroup(
    params: TCreateMessageParams,
  ): Promise<TCreateGroupMessageResponse> {
    const { author, content, id } = params;

    const group = await this._groupService.findGroupById(id);

    const isMember = await this._groupService.isUserInGroup({
      id,
      userId: author.id,
    });

    const newMessageGroup = this._messageGroupRepository.create({
      author,
      content,
      group,
    });

    const savedMessage = await this.saveMessageGroup(newMessageGroup);
    group.lastMessageSent = savedMessage;
    const updateGroup = await this._groupService.saveGroup(group);
    delete savedMessage.group;

    return {
      message: savedMessage,
      group: group,
    };
  }

  async getMessagesByGroupId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesGroupResponse> {
    const { limit, id, page } = params;

    const [data, total] = await this._messageGroupRepository
      .createQueryBuilder('message')
      .where('message.group.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .leftJoinAndSelect('message.author', 'author')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      groupId: id,
      messages: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async editMessage(params: TEditMessageParams): Promise<GroupMessage> {
    const { authorId, content, id, messageId } = params;

    const messageDB = await this._messageGroupRepository.findOne({
      where: { id: messageId, group: { id }, author: { id: authorId } },
      relations: ['author'],
    });
    if (!messageDB)
      throw new HttpException(
        'Message not found or you can not edit message',
        HttpStatus.BAD_REQUEST,
      );

    const group = await this._groupService.findGroupById(id);

    messageDB.content = content;
    const updatedMessage = await this.saveMessageGroup(messageDB);

    if (group.lastMessageSent.id === messageId) {
      await this._groupService.updateLastMessageGroup({
        id,
        lastMessageSent: updatedMessage,
      });
    }

    return updatedMessage;
  }

  async deleteMessageGroupById(
    params: TDeleteMessageParams,
  ): Promise<GroupMessage> {
    const { authorId, id, messageId } = params;

    const group = await this._groupService.findGroupById(id);

    const message = await this._messageGroupRepository.findOne({
      where: { id: messageId, author: { id: authorId } },
      relations: ['group', 'author'],
    });

    if (!message)
      throw new HttpException(
        'Message not found or you can not delete',
        HttpStatus.BAD_REQUEST,
      );

    if (group.lastMessageSent.id !== message.id) {
      await this._messageGroupRepository.delete({ id: messageId });
    } else {
      await this.deleteLastMessage(group.id, message);
    }

    return message;
  }

  async deleteLastMessage(groupId: string, message: GroupMessage) {
    const groupMessages = await this._messageGroupRepository.find({
      where: { group: { id: groupId } },
    });
    const size = groupMessages.length;
    const SECOND_MESSAGE_INDEX = 1;

    if (size <= 1) {
      console.log('last message groups sent is deleted');
      await this._groupService.updateLastMessageGroup({
        id: groupId,
        lastMessageSent: null,
      });

      return await this._messageGroupRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 conversation message');
      const newLastMessage = groupMessages[SECOND_MESSAGE_INDEX];
      await this._groupService.updateLastMessageGroup({
        id: groupId,
        lastMessageSent: newLastMessage,
      });

      return await this._messageGroupRepository.delete({ id: message.id });
    }
  }

  async saveMessageGroup(groupMessage: GroupMessage): Promise<GroupMessage> {
    return await this._messageGroupRepository.save(groupMessage);
  }
}

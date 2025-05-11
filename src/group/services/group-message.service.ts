import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IGroupMessageService, IGroupService } from 'src/utils/interfaces';
import { GroupMessage } from 'src/utils/typeorm';
import {
  TCreateGroupMessageResponse,
  TCreateMessageParams,
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

  async saveMessageGroup(groupMessage: GroupMessage): Promise<GroupMessage> {
    return await this._messageGroupRepository.save(groupMessage);
  }
}

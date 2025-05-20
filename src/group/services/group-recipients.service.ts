import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Services } from 'src/utils/constants';

import { validate as isUUID } from 'uuid';
import { IGroupRecipientsService } from '../interfaces/group-recipients.interface';
import { IGroupService } from '../interfaces/group.interface';
import { IUserService } from 'src/user/user.interface';
import {
  TAddRecipientToGroupParams,
  TAddRecipientToGroupResponse,
  TRemoveRecipientToGroupParams,
  TRemoveRecipientToGroupResponse,
} from '../types/group-recipients.type';

@Injectable()
export class GroupRecipientsService implements IGroupRecipientsService {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async addRecipientToGroup(
    params: TAddRecipientToGroupParams,
  ): Promise<TAddRecipientToGroupResponse> {
    const { id, ownerId, recipientId } = params;

    if (!isUUID(recipientId)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const group = await this._groupService.findGroupById(id);
    if (group.owner.id !== ownerId)
      throw new HttpException(
        'Insufficient Permissions',
        HttpStatus.BAD_REQUEST,
      );

    const recipient = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: recipientId },
    });

    if (!recipient)
      throw new HttpException('User does not exists !', HttpStatus.BAD_REQUEST);

    const isMember = await this._groupService.isUserInGroup({
      id,
      userId: recipientId,
    });

    if (isMember)
      throw new HttpException('User already in group!', HttpStatus.BAD_REQUEST);

    group.users.push(recipient);
    const savedGroup = await this._groupService.saveGroup(group);

    return {
      group: savedGroup,
      recipient,
    };
  }

  async removeRecipientToGroup(
    params: TRemoveRecipientToGroupParams,
  ): Promise<TRemoveRecipientToGroupResponse> {
    const { id, ownerId, recipientId } = params;

    if (!isUUID(recipientId)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const group = await this._groupService.findGroupById(id);
    if (group.owner.id !== ownerId)
      throw new HttpException(
        'Insufficient Permissions',
        HttpStatus.BAD_REQUEST,
      );

    if (ownerId === recipientId)
      throw new HttpException(
        'Can not leave group as owner',
        HttpStatus.BAD_REQUEST,
      );

    const recipient = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: recipientId },
    });

    if (!recipient)
      throw new HttpException('User does not exists !', HttpStatus.BAD_REQUEST);

    const isMember = await this._groupService.isUserInGroup({
      id,
      userId: recipientId,
    });
    if (!isMember)
      throw new HttpException(
        'You are not a member of the group yet.',
        HttpStatus.BAD_REQUEST,
      );

    const newUserGroup = group.users.filter((user) => user.id !== recipientId);

    group.users = newUserGroup;
    const saveGroup = await this._groupService.saveGroup(group);

    return {
      group: saveGroup,
      recipient,
    };
  }
}

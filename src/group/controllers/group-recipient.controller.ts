import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, GroupRecipientEvents, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import {
  ApiOwnerAddUserToGroupDoc,
  ApiOwnerRemoveUserToGroupDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { GroupRecipientAddUserDto } from '../dtos/recipients/group-recipient.add.dto';
import { GroupRecipientRemoveUserDto } from '../dtos/recipients/group-recipient.remove.dto';
import { IGroupRecipientsService } from '../interfaces/group-recipients.interface';

@ApiBearerAuth()
@ApiTags(Routes.GROUPS_RECIPIENTS)
@Controller(Routes.GROUPS_RECIPIENTS)
export class GroupRecipientController {
  constructor(
    @Inject(Services.GROUPS_RECIPIENTS)
    private readonly _groupRecipientService: IGroupRecipientsService,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  // api/group/:id/recipient
  @Post()
  @ApiOwnerAddUserToGroupDoc()
  async addRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientAddUserDto,
  ) {
    const params = { ownerId, id, recipientId };

    const res = await this._groupRecipientService.addRecipientToGroup(params);
    this._eventEmitter.emit(GroupRecipientEvents.GROUP_USER_ADD, res);
    return res;
  }

  // api/group/:id/recipient
  @Delete()
  @ApiOwnerRemoveUserToGroupDoc()
  async removeRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientRemoveUserDto,
  ) {
    const params = { ownerId, id, recipientId };
    const res =
      await this._groupRecipientService.removeRecipientToGroup(params);
    this._eventEmitter.emit(GroupRecipientEvents.GROUP_USER_REMOVE, res);

    return res;
  }
}

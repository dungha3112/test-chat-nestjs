import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Routes,
  ServerGroupRecipientEvent,
  Services,
} from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupRecipientsService } from 'src/utils/interfaces';
import {
  ApiOwnerAddUserToGroupDoc,
  ApiOwnerRemoveUserToGroupDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { GroupRecipientAddUserDto } from '../dtos/group-recipient.add.dto';
import { GroupRecipientRemoveUserDto } from '../dtos/group-recipient.remove.dto';
import { AddUserToGroupResDto, RemoveUserToGroupResDto } from '../dtos';
import { plainToInstance } from 'class-transformer';

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
  ): Promise<AddUserToGroupResDto> {
    const params = { ownerId, id, recipientId };

    const res = await this._groupRecipientService.addRecipientToGroup(params);
    this._eventEmitter.emit(ServerGroupRecipientEvent.GROUP_USER_ADD, res);
    return plainToInstance(AddUserToGroupResDto, res);
  }

  // api/group/:id/recipient
  @Delete()
  @ApiOwnerRemoveUserToGroupDoc()
  async removeRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientRemoveUserDto,
  ): Promise<RemoveUserToGroupResDto> {
    const params = { ownerId, id, recipientId };
    const res =
      await this._groupRecipientService.removeRecipientToGroup(params);
    this._eventEmitter.emit(ServerGroupRecipientEvent.GROUP_USER_REMOVE, res);

    return plainToInstance(RemoveUserToGroupResDto, res);
  }
}

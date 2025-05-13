import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  Routes,
  ServerGroupRecipientEvent,
  Services,
} from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupRecipientsService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { AddUserToGroupResDto, RemoveUserToGroupResDto } from '../dtos';
import { GroupRecipientAddUserDto } from '../dtos/group-recipient.add.dto';
import { GroupRecipientRemoveUserDto } from '../dtos/group-recipient.remove.dto';

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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Add new user to group' })
  @ApiBody({ type: GroupRecipientAddUserDto })
  @ApiResponse({
    status: 201,
    description: 'Add user to group successfully created.',
    type: AddUserToGroupResDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientAddUserDto,
  ) {
    const params = { ownerId, id, recipientId };

    const res = await this._groupRecipientService.addRecipientToGroup(params);
    this._eventEmitter.emit(ServerGroupRecipientEvent.GROUP_USER_ADD, res);
    return res;
  }

  // api/group/:id/recipient
  @Delete()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Remove new user to group' })
  @ApiBody({ type: GroupRecipientRemoveUserDto })
  @ApiResponse({
    status: 201,
    description: 'Remove user to group successfully created.',
    type: RemoveUserToGroupResDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async removeRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientRemoveUserDto,
  ) {
    const params = { ownerId, id, recipientId };
    const res =
      await this._groupRecipientService.removeRecipientToGroup(params);
    this._eventEmitter.emit(ServerGroupRecipientEvent.GROUP_USER_REMOVE, res);
    return res;
  }
}

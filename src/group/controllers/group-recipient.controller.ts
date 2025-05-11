import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupRecipientsService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupRecipientAddUserDto } from '../dtos/group-recipient.add.dto';
import { GroupRecipientRemoveUserDto } from '../dtos/group-recipient.remove.dto';

@Controller(Routes.GROUPS_RECIPIENTS)
export class GroupRecipientController {
  constructor(
    @Inject(Services.GROUPS_RECIPIENTS)
    private readonly _groupRecipientService: IGroupRecipientsService,
  ) {}

  // api/group/:id/recipient
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  async addRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientAddUserDto,
  ) {
    const params = { ownerId, id, recipientId };

    const res = await this._groupRecipientService.addRecipientToGroup(params);
    return res;
  }

  // api/group/:id/recipient
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Delete()
  async removeRecipientToGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { recipientId }: GroupRecipientRemoveUserDto,
  ) {
    const params = { ownerId, id, recipientId };
    const res =
      await this._groupRecipientService.removeRecipientToGroup(params);
    return res;
  }
}

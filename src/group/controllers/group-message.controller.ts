import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupMessageService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupMessageCreateDto } from '../dtos/group-message-create.dto';

@Controller(Routes.GROUP_MESSAGE)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGE)
    private readonly _groupMessageService: IGroupMessageService,
  ) {}

  @Post()
  async createNewGroupMessage(
    @AuthUser() author: User,
    @Param('id') id: string,
    @Body() { content }: GroupMessageCreateDto,
  ) {
    const params = { author, id, content };

    const newMessage =
      await this._groupMessageService.createMessageGroup(params);

    return newMessage;
  }
}

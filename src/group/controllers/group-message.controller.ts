import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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

  // api/group/:id/message
  @Get()
  async getMessagesByGroupId(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { id, page, limit };

    return await this._groupMessageService.getMessagesByGroupId(params);
  }

  // api/group/:id/message/:messageId
  @Delete(':messageId')
  async deleteMessageById(
    @AuthUser() { id: authorId }: User,

    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { authorId, id, messageId };

    const message =
      await this._groupMessageService.deleteMessageGroupById(params);

    return {
      groupId: id,
      messageId,
    };
  }
}

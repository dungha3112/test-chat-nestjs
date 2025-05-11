import {
  Body,
  Controller,
  DefaultValuePipe,
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

  @Get()
  async getMessagesByGroupId(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { id, page, limit };

    return await this._groupMessageService.getMessagesByGroupId(params);
  }
}

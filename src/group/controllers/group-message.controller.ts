import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, GroupMessageEvents, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupMessageService } from 'src/utils/interfaces';
import {
  ApiDeleteGroupMessageByGroupIdAndMessageIdDoc,
  ApiGroupMessageCreateDoc,
  ApiGroupMessagesGetDoc,
  ApiUpdateGroupMessageByGroupIdAndMessageIdDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { TMessageGroupPayload } from 'src/utils/types';
import { GroupMessageCreateDto } from '../dtos/messages/group-message-create.dto';
import { GroupMessageEditDto } from '../dtos/messages/group-message-edit.dto';

@ApiBearerAuth()
@ApiTags(Routes.GROUP_MESSAGE)
@Controller(Routes.GROUP_MESSAGE)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGE)
    private readonly _groupMessageService: IGroupMessageService,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiGroupMessageCreateDoc()
  async createNewGroupMessage(
    @AuthUser() author: User,
    @Param('id') id: string,
    @Body() { content }: GroupMessageCreateDto,
  ) {
    const params = { author, id, content };

    const res = await this._groupMessageService.createMessageGroup(params);

    const payload: TMessageGroupPayload = {
      groupId: res.group.id,
      message: res.message,
    };
    this._eventEmitter.emit(GroupMessageEvents.GROUP_MESSAGE_CREATE, payload);
    return res;
  }

  // api/group/:id/message
  @Get()
  @ApiGroupMessagesGetDoc()
  async getMessagesByGroupId(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { id, page, limit };
    const res = await this._groupMessageService.getMessagesByGroupId(params);

    return res;
  }

  // api/group/:id/message/:messageId
  @Patch(':messageId')
  @ApiUpdateGroupMessageByGroupIdAndMessageIdDoc()
  async updateMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() { content }: GroupMessageEditDto,
  ) {
    const params = { authorId, id, messageId, content };
    const message = await this._groupMessageService.editMessage(params);

    const payload: TMessageGroupPayload = { groupId: id, message: message };
    this._eventEmitter.emit(GroupMessageEvents.GROUP_MESSAGE_EDIT, payload);

    return { groupId: id, message };
  }

  // api/group/:id/message/:messageId
  @Delete(':messageId')
  @ApiDeleteGroupMessageByGroupIdAndMessageIdDoc()
  async deleteMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { authorId, id, messageId };

    const message =
      await this._groupMessageService.deleteMessageGroupById(params);

    const payload: TMessageGroupPayload = { groupId: id, message };
    this._eventEmitter.emit(GroupMessageEvents.GROUP_MESSAGE_DELETE, payload);

    return { groupId: id, message };
  }
}

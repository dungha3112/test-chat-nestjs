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
import { Throttle } from '@nestjs/throttler';
import { Routes, ServerGroupMessageEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupMessageService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupMessageCreateDto } from '../dtos/group-message-create.dto';
import { GroupMessageEditDto } from '../dtos/group-message-edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TMessageGroupPayload } from 'src/utils/types';

@Controller(Routes.GROUP_MESSAGE)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGE)
    private readonly _groupMessageService: IGroupMessageService,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
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
    this._eventEmitter.emit(
      ServerGroupMessageEvent.GROUP_MESSAGE_CREATE,
      payload,
    );
    return res;
  }

  // api/group/:id/message
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Patch(':messageId')
  async updateMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() { content }: GroupMessageEditDto,
  ) {
    const params = { authorId, id, messageId, content };
    const message = await this._groupMessageService.editMessage(params);

    const payload: TMessageGroupPayload = {
      groupId: id,
      message: message,
    };
    this._eventEmitter.emit(
      ServerGroupMessageEvent.GROUP_MESSAGE_EDIT,
      payload,
    );

    return {
      groupId: id,
      message,
    };
  }

  // api/group/:id/message/:messageId
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Delete(':messageId')
  async deleteMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { authorId, id, messageId };

    const message =
      await this._groupMessageService.deleteMessageGroupById(params);

    const payload: TMessageGroupPayload = { groupId: id, message };
    this._eventEmitter.emit(
      ServerGroupMessageEvent.GROUP_MESSAGE_DELETE,
      payload,
    );
    return {
      groupId: id,
      message,
    };
  }
}

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
import { Routes, ConverMessageEvents, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IConversationMessageService } from 'src/utils/interfaces';
import {
  ApiConverMessageCreateDoc,
  ApiDeleteConverMessageByConverIdAndMessageIdDoc,
  ApiGetConverMessagesByCorverIdDoc,
  ApiPatchConverMessageByConverIdAndMessageIdDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { TMessageConverPayload } from 'src/utils/types';
import { ConverMessageCreateDto, ConverMessageEditDto } from '../dtos';

@ApiBearerAuth()
@ApiTags(Routes.CONVERSATION_MESSAGE)
@Controller(Routes.CONVERSATION_MESSAGE)
export class ConversationMessageController {
  constructor(
    @Inject(Services.CONVERSATION_MESSAGE)
    private readonly _converMessageService: IConversationMessageService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiConverMessageCreateDoc()
  async createNewConverMessage(
    @AuthUser() author: User,
    @Param('id') id: string,
    @Body() { content }: ConverMessageCreateDto,
  ) {
    const params = { author, id, content };

    const res = await this._converMessageService.createMessageConver(params);

    const payload: TMessageConverPayload = {
      conversationId: id,
      message: res.message,
    };
    this._eventEmitter.emit(ConverMessageEvents.CONVER_MESSAGE_CREATE, payload);

    return res;
  }
  // api/conversation/:id/message
  @Get()
  @ApiGetConverMessagesByCorverIdDoc()
  async getMessagesByGroupId(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { id, page, limit };

    const res = await this._converMessageService.getMessagesByConverId(params);

    return res;
  }

  // api/conversation/:id/message/messageId
  @Patch(':messageId')
  @ApiPatchConverMessageByConverIdAndMessageIdDoc()
  async updateMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() { content }: ConverMessageEditDto,
  ) {
    const params = { authorId, id, messageId, content };
    const message = await this._converMessageService.editMessage(params);

    const payload: TMessageConverPayload = { conversationId: id, message };
    this._eventEmitter.emit(ConverMessageEvents.CONVER_MESSAGE_EDIT, payload);

    return { conversationId: id, message: message };
  }

  // api/conversation/:id/message/messageId
  @Delete(':messageId')
  @ApiDeleteConverMessageByConverIdAndMessageIdDoc()
  async deleteMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { authorId, id, messageId };

    const message =
      await this._converMessageService.deleteMessageConverById(params);

    const payload: TMessageConverPayload = {
      conversationId: id,
      message: message,
    };
    this._eventEmitter.emit(ConverMessageEvents.CONVER_MESSAGE_DELETE, payload);

    return { conversationId: id, message };
  }
}

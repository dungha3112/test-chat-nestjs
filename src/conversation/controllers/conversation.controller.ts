import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, ServerConversationEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IConversationService } from 'src/utils/interfaces';
import {
  ApiConversationCreateDoc,
  ApiFindConversationById,
  ApiUserGetConversaionDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { ConversationCreateDto } from '../dtos/conversation-create.dto';
import { ConverstionResDto } from '../dtos';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@ApiTags(Routes.CONVERSATION)
@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiConversationCreateDoc()
  async createNewConversation(
    @AuthUser() creator: User,
    @Body() conversationCreateDto: ConversationCreateDto,
  ): Promise<ConverstionResDto> {
    const params = { ...conversationCreateDto, creator };
    const newConversation =
      await this._conversationService.createNewConversation(params);

    this._eventEmitter.emit(
      ServerConversationEvent.CONVERSATION_CREATE,
      newConversation,
    );
    const resDto = plainToInstance(ConverstionResDto, newConversation, {
      excludeExtraneousValues: true,
    });
    return resDto;
  }

  @Get()
  @ApiUserGetConversaionDoc()
  async userGetConversations(
    @AuthUser() user: User,
  ): Promise<ConverstionResDto[]> {
    const conversations = await this._conversationService.userGetConversations(
      user.id,
    );

    const resDto = plainToInstance(ConverstionResDto, conversations);

    return resDto;
  }

  @Get(':id')
  @ApiFindConversationById()
  async findGrouById(@Param('id') id: string): Promise<ConverstionResDto> {
    const res = await this._conversationService.findConversationById(id);
    const resDto = plainToInstance(ConverstionResDto, res, {
      exposeDefaultValues: true,
    });
    return resDto;
  }
}

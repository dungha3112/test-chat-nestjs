import {
  HttpException,
  HttpStatus,
  Inject,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Services } from 'src/utils/constants';
import { IConversationService } from '../interfaces/conversation.interface';
import { AuthenticatedRequest } from 'src/user/user.type';

export class ConversationMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,
  ) {}
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const id = req.params.id;
    const params = { userId, id };

    const isReadable = await this._conversationService.hasAccess(params);

    if (isReadable) {
      next();
    } else {
      throw new HttpException(`Can't find you in chat`, HttpStatus.BAD_REQUEST);
    }
  }
}

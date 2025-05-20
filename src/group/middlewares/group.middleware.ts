import {
  HttpException,
  HttpStatus,
  Inject,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Services } from 'src/utils/constants';
import { IGroupService } from '../interfaces/group.interface';
import { AuthenticatedRequest } from 'src/user/user.type';

export class GroupMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const id = req.params.id;

    const params = { userId, id };
    const isMember = await this._groupService.isUserInGroup(params);
    if (!isMember) {
      throw new HttpException(
        'You are not a member of the group yet.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      next();
    }
  }
}

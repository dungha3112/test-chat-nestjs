import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Services } from '../constants';

import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/user/dtos';
import { ICustomJwtService } from 'src/custom-jwt/custom-jwt.interface';
import { IUserService } from 'src/user/user.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CUSTOM_JWT)
    private readonly _customJwtService: ICustomJwtService,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async use(request: Request, res: Response, next: NextFunction) {
    const accessToken = this._extractTokenFromHeader(request);

    if (!accessToken) {
      throw new HttpException(
        'Missing or invalid Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const { userId, jit } =
        await this._customJwtService.verifyAccessToken(accessToken);

      const user = await this._userService.findOne({
        options: { selectAll: true },
        params: { id: userId },
      });

      const userDto = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      request['user'] = userDto;
      next();
    } catch (error) {
      console.log('AuthMiddleware error ...');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

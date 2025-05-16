import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Services } from '../constants';
import { ICustomJwtService, IUserService } from '../interfaces';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/user/dtos';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CUSTOM_JWT)
    private readonly _customJwtService: ICustomJwtService,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async use(request: Request, res: Response, next: NextFunction) {
    const accessToken = this._extractTokenFromHeader(request);

    console.log(accessToken);

    if (!accessToken) {
      throw new HttpException(
        'Missing or invalid Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const { userId, jit } =
        await this._customJwtService.verifyAccessToken(accessToken);
      const sessionExists = await this._userService.findOneSesstion(
        userId,
        jit,
      );

      console.log(sessionExists);

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

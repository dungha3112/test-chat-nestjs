import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Services } from '../constants';
import { ICustomJwtService, IUserService } from '../interfaces';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(
    @Inject(Services.CUSTOM_JWT)
    private readonly _customJwtService: ICustomJwtService,
    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // add token to headers.authorization bearer
    const accessToken = this._extractTokenFromHeader(request);

    if (!accessToken) {
      throw new HttpException(
        'Missing or invalid Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded =
        await this._customJwtService.verifyAccessToken(accessToken);

      const user = await this._userService.findOne({
        options: { selectAll: false },
        params: { id: decoded.userId },
      });

      request['user'] = user;
    } catch (error) {
      console.log('Error auth jwt guard');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

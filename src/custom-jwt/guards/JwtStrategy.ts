import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';
import { TJwtPayload } from 'src/utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.USER)
    private readonly _userCustomService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: TJwtPayload) {
    console.log('Cookies in validate:', payload);

    const userDto = await this._userCustomService.findOne({
      options: { selectAll: false },
      params: { id: payload.userId },
    });
    if (!userDto)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return userDto;
  }
}

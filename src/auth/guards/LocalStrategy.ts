import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Strategy } from 'passport-local';
import { UserResponseDto } from 'src/user/dtos';
import { Services } from 'src/utils/constants';
import { IAuthService } from 'src/utils/interfaces';

// when user login & validate
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH) private readonly _authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log('when user login & validate');

    const user = await this._authService.validateUser({ email, password });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return userDto;
  }
}

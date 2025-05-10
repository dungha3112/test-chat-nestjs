import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IAuthService, IUserService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { TRegisterParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async register(params: TRegisterParams): Promise<string> {
    const { email, password, username } = params;

    const emailExists = await this._userService.findOne({
      options: { selectAll: false },
      params: { email },
    });
    if (emailExists)
      throw new HttpException(
        'User already exists with the email',
        HttpStatus.CONFLICT,
      );

    const usernameExists = await this._userService.findOne({
      options: { selectAll: false },
      params: { username },
    });
    if (usernameExists)
      throw new HttpException(
        'User already exists with the username',
        HttpStatus.CONFLICT,
      );

    return 'Registration successful';
  }
}

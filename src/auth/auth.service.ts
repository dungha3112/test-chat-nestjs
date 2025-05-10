import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { compareHash, hashPassword } from 'src/utils/helpers';
import { IAuthService, IUserService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { TLoginParams, TRegisterParams } from 'src/utils/types';
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

    const passwordHash = await hashPassword(password);

    const newUser = this._userRepository.create({
      email,
      username,
      password: passwordHash,
    });

    await this._userRepository.save(newUser);

    return 'Registration successful';
  }

  async login(params: TLoginParams): Promise<User> {
    const { email, password } = params;

    const user = await this._userService.findOne({
      options: { selectAll: true },
      params: { email },
    });
    if (!user)
      throw new HttpException('Invalid username', HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    return user;
  }
}

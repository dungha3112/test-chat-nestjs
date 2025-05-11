import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { Services } from 'src/utils/constants';
import { compareHash, hashPassword } from 'src/utils/helpers';
import {
  IAuthService,
  ICustomJwtService,
  IUserService,
} from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import {
  TLoginParams,
  TLoginResponse,
  TRefreshTokenResponse,
  TRegisterParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,

    @Inject(Services.USER) private readonly _userService: IUserService,

    @Inject(Services.CUSTOM_JWT)
    private readonly _customJwtService: ICustomJwtService,
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

  async login(params: TLoginParams): Promise<TLoginResponse> {
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

    const accessToken = await this._customJwtService.generateAccessToken(
      user.id,
    );
    const refreshToken = await this._customJwtService.generateRefreshToken(
      user.id,
    );

    user.refreshToken = refreshToken;
    await this._userService.saveUser(user);

    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }

  async refreshToken(refreshToken: string): Promise<TRefreshTokenResponse> {
    const decoded =
      await this._customJwtService.verifyRefreshToken(refreshToken);

    const accessToken = await this._customJwtService.generateAccessToken(
      decoded.userId,
    );

    const user = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: decoded.userId },
    });

    return { accessToken, user };
  }

  async logoutUser(userId: string): Promise<string> {
    await this._userRepository.update(userId, { refreshToken: null });
    return 'Logout successful';
  }
}

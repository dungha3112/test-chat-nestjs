import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Services } from 'src/utils/constants';
import { compareHash, hashPassword } from 'src/utils/helpers';
import {
  IAuthService,
  ICustomJwtService,
  IUserService,
} from 'src/utils/interfaces';
import { User, Sessions } from 'src/utils/typeorm';
import {
  TLoginParams,
  TLoginTokenResponse,
  TRefreshTokenResponse,
  TRegisterParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,

    @InjectRepository(Sessions)
    private readonly _sessionRepository: Repository<Sessions>,

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

  async loginUser(user: User, req: Request): Promise<TLoginTokenResponse> {
    const userId = user.id;

    const accessToken =
      await this._customJwtService.generateAccessToken(userId);

    const refreshToken = `${uuidv4()}-${uuidv4()}`;

    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 7);

    const newSession = this._sessionRepository.create({
      userId,
      refresh_token: refreshToken,
      expiresAt: expiresIn,
      // deviceName: req.headers['user-agent'],
      // deviceId: req.ip,
    });

    await this._sessionRepository.save(newSession);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<TRefreshTokenResponse> {
    if (!refreshToken)
      throw new HttpException(
        'No refresh token in body',
        HttpStatus.BAD_REQUEST,
      );

    const sessionExists = await this._sessionRepository.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!sessionExists)
      throw new HttpException(
        'User logged out from this device',
        HttpStatus.UNAUTHORIZED,
      );

    if (!sessionExists || sessionExists.expiresAt < new Date()) {
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: sessionExists.userId },
    });

    const accessToken = await this._customJwtService.generateAccessToken(
      sessionExists.userId,
    );

    return { accessToken, user };
  }

  async logoutUser(userId: string, refreshToken: string): Promise<string> {
    const sessionExists = await this._userService.findOneSesstion(
      userId,
      refreshToken,
    );

    await this._sessionRepository.delete({
      userId,
      refresh_token: refreshToken,
    });

    return 'Logout successful';
  }

  async validateUser(params: TLoginParams): Promise<User> {
    console.log(`validateUser ...`);

    const { password, email } = params;
    const user = await this._userService.findOne({
      options: { selectAll: true },
      params: { email },
    });

    if (!user)
      throw new HttpException('Invalid email', HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    return user;
  }
}

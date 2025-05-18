import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Services } from 'src/utils/constants';
import {
  compareHash,
  compareOtp,
  decryptOtp,
  hashPassword,
} from 'src/utils/helpers';
import {
  IAuthService,
  ICustomJwtService,
  IEmailService,
  IOtpService,
  IUserService,
} from 'src/utils/interfaces';
import { Sessions, User } from 'src/utils/typeorm';
import {
  TActiveAccountParams,
  TLoginParams,
  TLoginTokenResponse,
  TRefreshTokenResponse,
  TRegisterParams,
  TRestetPasswordParams,
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

    @Inject(Services.OTP) private readonly _otpService: IOtpService,

    @Inject(Services.EMAIL) private readonly _emailService: IEmailService,
  ) {}

  async register(params: TRegisterParams): Promise<string> {
    const { email, password, username } = params;

    const emailExists = await this._userService.findOne({
      options: { selectAll: true },
      params: { email },
    });

    const passwordHash = await hashPassword(password);

    if (emailExists) {
      if (emailExists.isVerify) {
        throw new HttpException(
          'The account has been activated. You can login now',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        emailExists.username = username;
        emailExists.password = passwordHash;
        await this._userService.saveUser(emailExists);
      }
    } else {
      const newUser = this._userRepository.create({
        email,
        username,
        password: passwordHash,
      });

      await this._userRepository.save(newUser);
    }

    const { otp, otpHash, type } = await this._otpService.createOtp({
      email,
      type: 'verify_email',
    });

    // sendMailToken
    // await this._emailService.sendMailToken(email, otpHash, type);

    // sendMailOtp
    await this._emailService.sendMailOTP(email, otp, type);
    return `Please check ${email}`;
  }

  async activeAccount(params: TActiveAccountParams): Promise<string> {
    const { email, otp } = params;

    const user = await this._userService.findOne({
      options: { selectAll: true },
      params: { email },
    });

    if (!user)
      throw new HttpException(
        'Account not found with email',
        HttpStatus.UNAUTHORIZED,
      );

    if (user.isVerify)
      throw new HttpException(
        'The account has been activated. You can login now',
        HttpStatus.BAD_REQUEST,
      );

    const otpExist = await this._otpService.findOneByParam({
      email,
      type: 'verify_email',
    });
    if (!otpExist)
      throw new HttpException(
        'This email is not valid for this action',
        HttpStatus.BAD_REQUEST,
      );

    if (otpExist.expiresAt < new Date())
      throw new HttpException('Expired otp', HttpStatus.BAD_REQUEST);

    const isMatch = compareOtp(otp, otpExist.otp);
    if (!isMatch)
      throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);

    user.isVerify = true;
    await this._userService.saveUser(user);

    await this._otpService.deleteById(otpExist.id);
    return 'Account verification successful.';
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

  async forgotPassword(email: string): Promise<string> {
    const user = await this._userService.findOne({
      options: { selectAll: true },
      params: { email },
    });
    if (!user)
      throw new HttpException(
        `Account not found with ${email}`,
        HttpStatus.NOT_FOUND,
      );
    if (!user.isVerify)
      throw new HttpException(
        'User has not authenticated account, Can not use forgot password method',
        HttpStatus.BAD_REQUEST,
      );

    const { otpHash, otp, type } = await this._otpService.createOtp({
      email,
      type: 'reset_password',
    });

    // sendMailToken
    // await this._emailService.sendMailToken(email, otpHash, type);

    // sendMailOTP
    await this._emailService.sendMailOTP(email, otp, type);

    return `Please check ${email}`;
  }

  async restetPassword(params: TRestetPasswordParams): Promise<string> {
    const { email, password, otp } = params;

    const user = await this._userService.findOne({
      options: { selectAll: true },
      params: { email },
    });
    if (!user)
      throw new HttpException(
        `Account not found with ${email}`,
        HttpStatus.NOT_FOUND,
      );
    if (!user.isVerify)
      throw new HttpException(
        'Account not verified. Forgot password unavailable.',
        HttpStatus.BAD_REQUEST,
      );

    const hashPass = await hashPassword(password);

    const otpExist = await this._otpService.findOneByParam({
      email,
      type: 'reset_password',
    });
    if (!otpExist)
      throw new HttpException(
        'Password cannot be reset without request.',
        HttpStatus.BAD_REQUEST,
      );

    if (otpExist.expiresAt < new Date())
      throw new HttpException('Expired otp', HttpStatus.BAD_REQUEST);

    const isMatch = compareOtp(otp, otpExist.otp);
    if (!isMatch)
      throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);

    user.password = hashPass;
    await this._userService.saveUser(user);
    await this._otpService.deleteById(otpExist.id);

    return `Reset password successfully. You can login now!`;
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

    if (!user.isVerify)
      throw new HttpException(
        'User has not authenticated account',
        HttpStatus.BAD_REQUEST,
      );

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    return user;
  }
}

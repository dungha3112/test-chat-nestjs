import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Routes, Services } from 'src/utils/constants';
import { AuthJwtGuard } from 'src/utils/guards/AuthJwtGuard';
import { IAuthService } from 'src/utils/interfaces';
import {
  ApiLoginDoc,
  ApiLogoutDoc,
  ApiRefreshTokenDoc,
  ApiRegisterDoc,
} from 'src/utils/swaggers';
import { AuthenticatedRequest } from 'src/utils/types/user.type';
import {
  UserLoginDto,
  UserLoginResponseDto,
  UserRefreshTokenResponseDto,
  UserRegisterDto,
} from './dtos';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/user/dtos';

@ApiTags(Routes.AUTH)
@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly _authService: IAuthService,
  ) {}

  @Post('register')
  @ApiRegisterDoc()
  async registerUser(
    @Body() registerDto: UserRegisterDto,
  ): Promise<{ message: string }> {
    const message = await this._authService.register(registerDto);

    return { message };
  }

  @Post('login')
  @ApiLoginDoc()
  async loginUser(
    @Body() loginDto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserLoginResponseDto> {
    const { accessToken, refreshToken, user } =
      await this._authService.login(loginDto);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return { accessToken, user: userDto };
  }

  @Post('refresh-token')
  @ApiRefreshTokenDoc()
  async refreshToken(
    @Req() request: Request,
  ): Promise<UserRefreshTokenResponseDto> {
    const refresh_token = request.cookies['refresh_token'];

    const { user, accessToken } =
      await this._authService.refreshToken(refresh_token);

    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return { accessToken, user: userDto };
  }

  @Post('logout')
  @ApiLogoutDoc()
  @UseGuards(AuthJwtGuard)
  async loggout(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    try {
      const message = await this._authService.logoutUser(request.user.id);

      response.clearCookie('refresh_token');

      return response.status(200).json({ message });
    } catch (error) {
      return response
        .status(error?.status || 500)
        .json({ message: error?.message || 'Logout failed' });
    }
  }
}

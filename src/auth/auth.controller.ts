import {
  Body,
  Controller,
  Headers,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UserResponseDto } from 'src/user/dtos';
import { Routes, Services } from 'src/utils/constants';
import { AuthJwtGuard, LocalAuthGuard } from 'src/utils/guards';
import { IAuthService } from 'src/utils/interfaces';
import {
  ApiLoginDoc,
  ApiLogoutDoc,
  ApiRefreshTokenDoc,
  ApiRegisterDoc,
} from 'src/utils/swaggers';
import { AuthenticatedRequest } from 'src/utils/types/user.type';
import { UserRefreshTokenResponseDto, UserRegisterDto } from './dtos';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

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
  @UseGuards(LocalAuthGuard)
  @ApiLoginDoc()
  async loginUser(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user;

    const { accessToken, refreshToken } = await this._authService.loginUser(
      user,
      request,
    );

    // const isMobile = request.headers['user-agent']?.includes('MyMobileApp');
    const isMobile = request.headers['x-client-type'] === 'mobile';

    //    headers: {
    //   'Content-Type': 'application/json',
    //   'X-Client-Type': 'mobile',
    // },

    if (isMobile) {
      return { accessToken, refreshToken, user: request.user };
    } else {
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return { accessToken, user: request.user };
    }
  }

  @Post('refresh-token')
  @ApiRefreshTokenDoc()
  async refreshToken(
    @Req() request: Request,
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<UserRefreshTokenResponseDto> {
    let refresh_token: string;

    if (request.headers['x-client-type'] === 'mobile') {
      refresh_token = refreshToken;
    } else {
      refresh_token = request.cookies['refresh_token'];
    }

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
    @Body() { refreshToken }: RefreshTokenDto,
    @Res() response: Response,
  ) {
    let refresh_token: string;

    if (request.headers['x-client-type'] === 'mobile') {
      refresh_token = refreshToken;
    } else {
      refresh_token = request.cookies['refresh_token'];
    }

    try {
      const message = await this._authService.logoutUser(
        request.user.id,
        refresh_token,
      );

      response.clearCookie('refresh_token');

      return response.status(200).json({ message });
    } catch (error) {
      return response
        .status(error?.status || 500)
        .json({ message: error?.message || 'Logout failed' });
    }
  }
}

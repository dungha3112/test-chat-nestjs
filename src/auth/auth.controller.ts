import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { Routes, Services } from 'src/utils/constants';
import { AuthJwtGuard } from 'src/utils/guards/AuthJwtGuard';
import { IAuthService } from 'src/utils/interfaces';
import { AuthenticatedRequest } from 'src/utils/types/user.type';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserRegisterDto } from './dtos/user-register.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly _authService: IAuthService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() registerDto: UserRegisterDto,
  ): Promise<{ message: string }> {
    const message = await this._authService.register(registerDto);

    return { message };
  }

  @Post('login')
  async loginUser(
    @Body() loginDto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this._authService.login(loginDto);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return {
      accessToken,
      user,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Req() request: Request) {
    const refresh_token = request.cookies['refresh_token'];

    const { user, accessToken } =
      await this._authService.refreshToken(refresh_token);
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      accessToken,
      user: userDto,
    };
  }

  @Post('logout')
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

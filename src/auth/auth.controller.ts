import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { Routes, Services } from 'src/utils/constants';
import { AuthJwtGuard } from 'src/utils/guards/AuthJwtGuard';
import { IAuthService } from 'src/utils/interfaces';
import { AuthenticatedRequest } from 'src/utils/types/user.type';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  UserLoginResponseDto,
  UserRefreshTokenResponseDto,
} from './dtos/index.dto';

@Controller(Routes.AUTH)
@ApiTags(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly _authService: IAuthService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: UserRegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async registerUser(
    @Body() registerDto: UserRegisterDto,
  ): Promise<{ message: string }> {
    const message = await this._authService.register(registerDto);

    return { message };
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully, accessToken returned',
    type: UserLoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
  @ApiOperation({ summary: 'Get new access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: UserRefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid refresh token' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
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
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Logout user and clear refresh token cookie' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

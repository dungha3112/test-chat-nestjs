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
import e, { Request, Response } from 'express';
import { UserResponseDto } from 'src/user/dtos';
import { Routes, Services } from 'src/utils/constants';
import { AuthJwtGuard, LocalAuthGuard } from 'src/utils/guards';
import { IAuthService } from 'src/utils/interfaces';
import {
  ApiActiveAccountDoc,
  ApiForgotPasswordDoc,
  ApiLoginDoc,
  ApiLogoutDoc,
  ApiRefreshTokenDoc,
  ApiRegisterDoc,
  ApiResetPasswordDoc,
} from 'src/utils/swaggers';
import { AuthenticatedRequest } from 'src/utils/types/user.type';
import {
  ActiveAccountDto,
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  UserRefreshTokenResponseDto,
  UserRegisterDto,
} from './dtos';

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

  @Post('active-account')
  @ApiActiveAccountDoc()
  async activeAccount(@Body() activeAccountDto: ActiveAccountDto) {
    const message = await this._authService.activeAccount(activeAccountDto);

    return { message };
  }

  @Post('forgot-password')
  @ApiForgotPasswordDoc()
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    const message = await this._authService.forgotPassword(email);

    return { message };
  }

  @Post('reset-password')
  @ApiResetPasswordDoc()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const message = await this._authService.restetPassword(resetPasswordDto);

    return { message };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiLoginDoc()
  async loginUser(@Req() request: AuthenticatedRequest) {
    const user = request.user;

    const { accessToken, refreshToken } = await this._authService.loginUser(
      user,
      request,
    );

    return { accessToken, user: request.user, refreshToken };
  }

  @Post('refresh-token')
  @ApiRefreshTokenDoc()
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<UserRefreshTokenResponseDto> {
    const { user, accessToken } =
      await this._authService.refreshToken(refreshToken);

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
    try {
      const message = await this._authService.logoutUser(
        request.user.id,
        refreshToken,
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

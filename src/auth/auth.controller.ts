import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from 'src/utils/interfaces';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UserLoginDto } from './dtos/user-login.dto';

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
  async loginUser(@Body() loginDto: UserLoginDto) {
    return await this._authService.login(loginDto);
  }
}

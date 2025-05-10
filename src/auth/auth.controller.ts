import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from 'src/utils/interfaces';
import { AuthRegisterDto } from './dtos/auth-register.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly _authService: IAuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() registerDto: AuthRegisterDto) {
    return await this._authService.register(registerDto);
  }
}

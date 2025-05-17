import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  UserLoginResponseDto,
  UserRefreshTokenResponseDto,
} from 'src/auth/dtos';
import { RefreshTokenDto } from 'src/auth/dtos/refresh-token.dto';
import { UserLoginDto } from 'src/auth/dtos/user-login.dto';
import { UserRegisterDto } from 'src/auth/dtos/user-register.dto';

export function ApiRegisterDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Register user' }),
    ApiBody({ type: UserRegisterDto }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
      type: String,
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function ApiLoginDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiBody({ type: UserLoginDto }),
    ApiResponse({
      status: 200,
      description: 'User logged in successfully, accessToken returned',
      type: UserLoginResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}

export function ApiRefreshTokenDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get new access token using refresh token' }),
    ApiBody({ type: RefreshTokenDto }),
    ApiResponse({
      status: 200,
      description: 'Token refreshed successfully',
      type: UserRefreshTokenResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Missing or invalid refresh token',
    }),
  );
}

export function ApiLogoutDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user and clear refresh token cookie' }),
    ApiBody({ type: RefreshTokenDto }),
    ApiResponse({
      status: 200,
      description: 'User logged out successfully',
      type: String,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiBearerAuth(),
  );
}

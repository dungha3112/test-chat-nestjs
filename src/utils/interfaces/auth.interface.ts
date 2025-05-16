import { Request } from 'express';
import { User } from '../typeorm';
import {
  TLoginParams,
  TLoginTokenResponse,
  TRefreshTokenResponse,
  TRegisterParams,
} from '../types';

export interface IAuthService {
  register(params: TRegisterParams): Promise<string>;

  validateUser(params: TLoginParams): Promise<User>;

  loginUser(user: User, req: Request): Promise<TLoginTokenResponse>;

  refreshToken(token: string): Promise<TRefreshTokenResponse>;

  logoutUser(userId: string, refreshToken: string): Promise<string>;
}

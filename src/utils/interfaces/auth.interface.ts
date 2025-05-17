import { Request } from 'express';
import { User } from '../typeorm';
import {
  TActiveAccountParams,
  TLoginParams,
  TLoginTokenResponse,
  TRefreshTokenResponse,
  TRegisterParams,
  TRestetPasswordParams,
} from '../types';

export interface IAuthService {
  register(params: TRegisterParams): Promise<string>;
  activeAccount(params: TActiveAccountParams): Promise<string>;

  forgotPassword(email: string): Promise<string>;

  restetPassword(params: TRestetPasswordParams): Promise<string>;

  validateUser(params: TLoginParams): Promise<User>;

  loginUser(user: User, req: Request): Promise<TLoginTokenResponse>;

  refreshToken(token: string): Promise<TRefreshTokenResponse>;

  logoutUser(userId: string, refreshToken: string): Promise<string>;
}

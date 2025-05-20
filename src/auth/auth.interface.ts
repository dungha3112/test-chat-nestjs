import { Request } from 'express';
import {
  TActiveAccountParams,
  TLoginParams,
  TLoginTokenResponse,
  TRefreshTokenResponse,
  TRegisterParams,
  TRestetPasswordParams,
} from './auth.type';
import { User } from 'src/utils/typeorm';

export interface IAuthService {
  register(params: TRegisterParams): Promise<string>;
  activeAccount(params: TActiveAccountParams): Promise<string>;

  forgotPassword(email: string): Promise<string>;

  restetPassword(params: TRestetPasswordParams): Promise<string>;

  validateUser(params: TLoginParams): Promise<User>;

  loginUser(user: User, req: Request): Promise<TLoginTokenResponse>;

  refreshToken(token: string): Promise<TRefreshTokenResponse>;

  logoutUser(refreshToken: string): Promise<string>;
}

import {
  TLoginParams,
  TLoginResponse,
  TRefreshTokenResponse,
  TRegisterParams,
} from '../types/auth.type';

export interface IAuthService {
  register(params: TRegisterParams): Promise<string>;
  login(params: TLoginParams): Promise<TLoginResponse>;
  refreshToken(token: string): Promise<TRefreshTokenResponse>;

  logoutUser(userId: string): Promise<string>;
}

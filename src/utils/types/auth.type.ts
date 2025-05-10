import { User } from '../typeorm';

export type TRegisterParams = TLoginParams & {
  username: string;
};

export type TLoginParams = {
  email: string;
  password: string;
};

export type TLoginResponse = TRefreshTokenResponse & {
  refreshToken: string;
};

export type TRefreshTokenResponse = {
  user: User;
  accessToken: string;
};

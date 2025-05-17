import { User } from '../typeorm';

export type TRegisterParams = TLoginParams & {
  username: string;
};

export type TActiveAccountParams = {
  email: string;
  url: string;
};

export type TRestetPasswordParams = {
  email: string;
  url: string;
  password: string;
};

export type TLoginParams = {
  email: string;
  password: string;
};

export type TRefreshTokenResponse = {
  user: User;
  accessToken: string;
};

export type TLoginTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

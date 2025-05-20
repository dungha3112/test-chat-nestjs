import { User } from 'src/utils/typeorm';

export type TRegisterParams = TLoginParams & {
  username: string;
};

export type TActiveAccountParams = {
  email: string;
  // url: string;
  otp: string;
};

export type TRestetPasswordParams = {
  email: string;
  // url: string;
  otp: string;
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

import { UserResponseDto } from 'src/user/dtos/user-response.dto';

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
  user: UserResponseDto;
  accessToken: string;
};

import { User } from '../typeorm';
import { TLoginParams, TRegisterParams } from '../types/auth.type';

export interface IAuthService {
  register(params: TRegisterParams): Promise<string>;
  login(params: TLoginParams): Promise<User>;
}

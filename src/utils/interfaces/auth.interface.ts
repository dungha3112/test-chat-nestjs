import { TRegisterParams } from '../types/auth.type';

export interface IAuthService {
  register(params: TRegisterParams): Promise<string>;
}

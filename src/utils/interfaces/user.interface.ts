import { User } from '../typeorm';
import { TFindUserDetails } from '../types';

export interface IUserService {
  findOne(findUserDetails: TFindUserDetails): Promise<User>;

  saveUser(params: User): Promise<User>;
}

import { User } from '../typeorm';
import { TFindUserDetails } from '../types/user.type';

export interface IUserService {
  findOne(findUserDetails: TFindUserDetails): Promise<User>;
}

import { Sessions, User } from '../utils/typeorm';
import { TFindUserDetails } from './user.type';

export interface IUserService {
  findOne(findUserDetails: TFindUserDetails): Promise<User>;

  searchUser(query: string): Promise<User[]>;

  saveUser(params: User): Promise<User>;
}

import { User } from '../typeorm';
import { TFindUserDetails } from '../types';

export interface IUserService {
  findOne(findUserDetails: TFindUserDetails): Promise<User>;

  searchUser(query: string): Promise<User[]>;

  saveUser(params: User): Promise<User>;
}

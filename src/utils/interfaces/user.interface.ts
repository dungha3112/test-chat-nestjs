import { User } from '../typeorm';
import { TFindUserDetails, TUserReponse } from '../types/user.type';

export interface IUserService {
  findOne(findUserDetails: TFindUserDetails): Promise<User>;

  saveUser(params: User): Promise<TUserReponse>;
}

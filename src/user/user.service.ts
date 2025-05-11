import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { TFindUserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
  ) {}

  async findOne(findUserDetails: TFindUserDetails): Promise<User> {
    const { options, params } = findUserDetails;

    const selections: (keyof User)[] = ['id', 'email', 'username', 'createdAt'];

    const selectionsWithPassword: (keyof User)[] = [
      ...selections,
      'password',
      'refreshToken',
    ];

    const user = await this._userRepository.findOne({
      where: params,
      select: options?.selectAll ? selectionsWithPassword : selections,
    });

    return user;
  }

  async saveUser(params: User): Promise<User> {
    const newUser = await this._userRepository.save(params);

    return newUser;
  }
}

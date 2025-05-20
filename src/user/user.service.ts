import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './user.interface';
import { TFindUserDetails } from './user.type';

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
      'isVerify',
    ];

    const user = await this._userRepository.findOne({
      where: params,
      select: options?.selectAll ? selectionsWithPassword : selections,
    });

    return user;
  }

  async searchUser(query: string): Promise<User[]> {
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);

    const statement = `(user.username LIKE :query)`;

    const users = await this._userRepository
      .createQueryBuilder('user')
      .where(statement, { query: `%${query}%` })
      .limit(10)
      .addSelect(['user.username', 'user.id'])
      .getMany();

    return users;
  }

  async saveUser(params: User): Promise<User> {
    const newUser = await this._userRepository.save(params);

    return newUser;
  }
}

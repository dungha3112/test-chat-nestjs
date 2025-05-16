import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/utils/interfaces';
import { Sessions, User } from 'src/utils/typeorm';
import { TFindUserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,

    @InjectRepository(Sessions)
    private readonly _sessionRepository: Repository<Sessions>,
  ) {}

  async findOne(findUserDetails: TFindUserDetails): Promise<User> {
    const { options, params } = findUserDetails;

    const selections: (keyof User)[] = ['id', 'email', 'username', 'createdAt'];

    const selectionsWithPassword: (keyof User)[] = [...selections, 'password'];

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

  async findOneSesstion(
    userId: string,
    refresh_token: string,
  ): Promise<Sessions> {
    const session = await this._sessionRepository.findOne({
      where: { userId, refresh_token },
    });

    if (!session)
      throw new HttpException(
        'User logged out from this device',
        HttpStatus.UNAUTHORIZED,
      );

    return session;
  }
}

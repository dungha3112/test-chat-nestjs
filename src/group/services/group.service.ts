import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IGroupService, IUserService } from 'src/utils/interfaces';
import { Group } from 'src/utils/typeorm';
import { TCreateGroupParams } from 'src/utils/types/group.type';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly _groupRepository: Repository<Group>,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async createGroup(params: TCreateGroupParams): Promise<Group> {
    const { ownerId, title, users } = params;

    const userPromise = users.map(async (id) => {
      if (!isUUID(id)) {
        throw new HttpException(
          `Invalid UUID format with`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this._userService.findOne({
        options: { selectAll: false },
        params: { id },
      });

      if (!user)
        throw new HttpException(
          `User not found with ${id}`,
          HttpStatus.BAD_REQUEST,
        );

      return id;
    });

    const usersDb = await Promise.all(userPromise);

    usersDb.push(ownerId);

    const newGroup = this._groupRepository.create({
      owner: { id: ownerId },
      users: usersDb.map((id) => ({ id })),
      title,
    });

    const savedGroup = await this._groupRepository.save(newGroup);

    return savedGroup;
  }

  async getGroups(userId: string): Promise<Group[]> {
    const groups = await this._groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:...users)', { users: [userId] })

      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.owner', 'owner')

      .getMany();

    return groups;
  }
}

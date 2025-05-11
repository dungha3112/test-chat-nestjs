import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IGroupService, IUserService } from 'src/utils/interfaces';
import { Group, User } from 'src/utils/typeorm';
import {
  TCheckUserInGroupParams,
  TCreateGroupParams,
  TEditGroupParams,
  TUpdateLastMessageParams,
  TUpdateOwnerGroupPrams,
  TUserLeaveGroup,
} from 'src/utils/types';
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
        throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
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

    const savedGroup = await this.saveGroup(newGroup);

    return savedGroup;
  }

  async getGroups(userId: string): Promise<Group[]> {
    const groups = await this._groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:...users)', { users: [userId] })

      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.owner', 'owner')
      // .limit(2).take(2)
      .getMany();

    return groups;
  }

  async findGroupById(id: string): Promise<Group> {
    if (!isUUID(id)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const group = await this._groupRepository.findOne({
      where: { id },
      relations: [
        'lastMessageSent',
        'users',
        'owner',
        'lastMessageSent.author',
      ],
    });

    if (!group)
      throw new HttpException('Group not found with id', HttpStatus.NOT_FOUND);

    return group;
  }

  async isUserInGroup(params: TCheckUserInGroupParams): Promise<User> {
    const { userId, id } = params;

    if (!isUUID(id)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const group = await this.findGroupById(id);

    const user = group.users.find((u) => u.id === userId);

    return user;
  }

  async updateOwnerGroup(params: TUpdateOwnerGroupPrams): Promise<Group> {
    const { id, newOwnerId, ownerId } = params;

    if (!isUUID(newOwnerId)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const group = await this.findGroupById(id);
    const isMember = await this.isUserInGroup({ id, userId: newOwnerId });
    if (!isMember) {
      throw new HttpException(
        'You are not a member of the group yet.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (group.owner.id !== ownerId)
      throw new HttpException(
        'Insufficient Permissions',
        HttpStatus.BAD_REQUEST,
      );

    if (group.owner.id === newOwnerId)
      throw new HttpException(
        'Cannot Transfer Owner to yourself',
        HttpStatus.BAD_REQUEST,
      );

    group.owner.id = newOwnerId;

    const newGroup = await this.saveGroup(group);
    return newGroup;
  }

  async userLeaveGroup(params: TUserLeaveGroup): Promise<Group> {
    const { id, userId } = params;
    const group = await this.findGroupById(id);

    const isMember = await this.isUserInGroup({ id, userId });
    if (!isMember)
      throw new HttpException(
        'You are not a member of the group yet.',
        HttpStatus.BAD_REQUEST,
      );

    if (userId === group.owner.id)
      throw new HttpException(
        'Cannot leave group as owner',
        HttpStatus.BAD_REQUEST,
      );

    group.users = group.users.filter((u) => u.id !== userId);

    const updateGroup = await this.saveGroup(group);
    return updateGroup;
  }

  async updateLastMessageGroup(params: TUpdateLastMessageParams) {
    const { id, lastMessageSent } = params;
    return await this._groupRepository.update(id, { lastMessageSent });
  }

  async editGrouById(params: TEditGroupParams): Promise<Group> {
    const { id, ownerId, title } = params;

    const group = await this.findGroupById(id);
    if (group.owner.id !== ownerId)
      throw new HttpException(
        'You not owner group and can not edit',
        HttpStatus.BAD_REQUEST,
      );

    group.title = title;
    const updateGroup = await this.saveGroup(group);
    return updateGroup;
  }

  async saveGroup(group: Group): Promise<Group> {
    return await this._groupRepository.save(group);
  }
}

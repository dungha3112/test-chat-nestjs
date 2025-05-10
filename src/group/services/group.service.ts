import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { IGroupService, IUserService } from 'src/utils/interfaces';
import { Group } from 'src/utils/typeorm';
import { TCreateGroupParams } from 'src/utils/types/group.type';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly _groupRepository: Repository<Group>,

    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  async createGroup(params: TCreateGroupParams): Promise<Group> {
    const { ownerId, title, users } = params;

    console.log({ users });

    console.log(
      users.map((user) => {
        console.log(user);
      }),
    );

    const userPromise = users.map(async (id) => {
      const user = await this._userService.findOne({
        options: { selectAll: false },
        params: { id },
      });

      return user ? id : null;
    });

    const usersDb = await Promise.all(userPromise);

    usersDb.push(ownerId);

    console.log({ usersDb });

    throw new Error('Method not implemented.');
  }
}

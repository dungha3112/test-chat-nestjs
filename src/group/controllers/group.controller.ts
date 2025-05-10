import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGroupService } from 'src/utils/interfaces';
import { GroupCreateDto } from '../dtos/group-create.dto';
import { User } from 'src/utils/typeorm';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,
  ) {}

  @Post()
  async createGroup(
    @AuthUser() { id: ownerId }: User,
    @Body() groupDto: GroupCreateDto,
  ) {
    const params = { ...groupDto, ownerId };

    const newGroup = await this._groupService.createGroup(params);

    return newGroup;
  }

  @Get()
  async getGroup(@AuthUser() user: User) {
    return await this._groupService.getGroups(user.id);
  }
}

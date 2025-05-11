import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupCreateDto } from '../dtos/group-create.dto';

@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  async createGroup(
    @AuthUser() { id: ownerId }: User,
    @Body() groupDto: GroupCreateDto,
  ) {
    const params = { ...groupDto, ownerId };

    const newGroup = await this._groupService.createGroup(params);

    return newGroup;
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get()
  async getGroup(@AuthUser() user: User) {
    return await this._groupService.getGroups(user.id);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get(':id')
  async findGrouById(@Param('id') id: string) {
    return await this._groupService.findGroupById(id);
  }
}

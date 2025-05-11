import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupCreateDto } from '../dtos/group-create.dto';
import { GroupAddUserDto } from '../dtos/group-add-user.dto';
import { GroupEditDto } from '../dtos/group-edit.dto';

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

  // api/group/:id
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get(':id')
  async findGrouById(@Param('id') id: string) {
    return await this._groupService.findGroupById(id);
  }

  // api/group/:id
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Patch(':id')
  async editGrouById(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { title }: GroupEditDto,
  ) {
    return await this._groupService.editGrouById({ id, title, ownerId });
  }

  // api/group/:id/owner
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Patch(':id/owner')
  async updateOwnerGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { newOwnerId }: GroupAddUserDto,
  ) {
    const params = { ownerId, id, newOwnerId };

    const newGroup = await this._groupService.updateOwnerGroup(params);
    return newGroup;
  }

  // api/groups/:id/leave
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Delete('/:id/leave')
  async leaveGroupById(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };
    const group = await this._groupService.userLeaveGroup(params);

    return group;
  }
}

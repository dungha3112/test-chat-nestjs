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
import { Routes, ServerGroupEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupCreateDto } from '../dtos/group-create.dto';
import { GroupAddUserDto } from '../dtos/group-add-user.dto';
import { GroupEditDto } from '../dtos/group-edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  async createGroup(@AuthUser() owner: User, @Body() groupDto: GroupCreateDto) {
    const params = { ...groupDto, owner };

    const newGroup = await this._groupService.createGroup(params);

    this._eventEmitter.emit(ServerGroupEvent.GROUP_CREATE, newGroup);

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
    const newGroup = await this._groupService.editGrouById({
      id,
      title,
      ownerId,
    });
    this._eventEmitter.emit(ServerGroupEvent.GROUP_UPDATE, newGroup);
    return newGroup;
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
    this._eventEmitter.emit(ServerGroupEvent.GROUP_OWNER_UPDATE, newGroup);
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
    this._eventEmitter.emit(ServerGroupEvent.GROUP_USER_LEAVE, {
      group,
      userId,
    });
    return group;
  }
}

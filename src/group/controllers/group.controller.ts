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
import { Group, User } from 'src/utils/typeorm';
import { GroupCreateDto } from '../dtos/group-create.dto';
import { GroupAddUserDto } from '../dtos/group-add-user.dto';
import { GroupEditDto } from '../dtos/group-edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags(Routes.GROUP)
@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create new group' })
  @ApiBody({ type: GroupCreateDto })
  @ApiResponse({
    status: 201,
    description: 'The group successfully created.',
    type: Group,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createGroup(@AuthUser() owner: User, @Body() groupDto: GroupCreateDto) {
    const params = { ...groupDto, owner };

    const newGroup = await this._groupService.createGroup(params);

    this._eventEmitter.emit(ServerGroupEvent.GROUP_CREATE, newGroup);

    return newGroup;
  }

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get list group' })
  @ApiResponse({
    status: 201,
    description: 'Get list group successfully.',
    type: [Group],
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getGroup(@AuthUser() user: User) {
    return await this._groupService.getGroups(user.id);
  }

  // api/group/:id
  @Get(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a group by id' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiResponse({
    status: 201,
    description: 'Get group successfully',
    type: Group,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async findGrouById(@Param('id') id: string) {
    return await this._groupService.findGroupById(id);
  }

  // api/group/:id
  @Patch(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Owner update group by id' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiResponse({
    status: 201,
    description: 'Update group successfully',
    type: Group,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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
  @Patch(':id/owner')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Tranfer owner' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiResponse({
    status: 201,
    description: 'Tranfer owner successfully',
    type: Group,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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
  @Delete('/:id/leave')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'User leave group' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiResponse({
    status: 201,
    description: 'User leave successfully',
    type: Group,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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

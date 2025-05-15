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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, ServerGroupEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupService } from 'src/utils/interfaces';
import {
  ApiGetGroupByIdDoc,
  ApiGroupCreateDoc,
  ApiGroupsGetDoc,
  ApiPatchGroupByIdDoc,
  ApiPatchOnwerGroupByIdDoc,
  ApiUserLeaveGroupByIdDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { GroupAddUserDto } from '../dtos/groups/group-add-user.dto';
import { GroupCreateDto } from '../dtos/groups/group-create.dto';
import { GroupEditDto } from '../dtos/groups/group-edit.dto';
import { GroupResDto } from '../dtos';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@ApiTags(Routes.GROUP)
@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly _groupService: IGroupService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiGroupCreateDoc()
  async createGroup(
    @AuthUser() owner: User,
    @Body() groupDto: GroupCreateDto,
  ): Promise<GroupResDto> {
    const params = { ...groupDto, owner };

    const newGroup = await this._groupService.createGroup(params);

    this._eventEmitter.emit(ServerGroupEvent.GROUP_CREATE, newGroup);

    return plainToInstance(GroupResDto, newGroup);
  }

  @Get()
  @ApiGroupsGetDoc()
  async getGroup(@AuthUser() user: User): Promise<GroupResDto[]> {
    const res = await this._groupService.getGroups(user.id);
    return plainToInstance(GroupResDto, res);
  }

  // api/group/:id
  @Get(':id')
  @ApiGetGroupByIdDoc()
  async findGrouById(@Param('id') id: string): Promise<GroupResDto> {
    const res = await this._groupService.findGroupById(id);

    return plainToInstance(GroupResDto, res);
  }

  // api/group/:id
  @Patch(':id')
  @ApiPatchGroupByIdDoc()
  async editGrouById(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { title }: GroupEditDto,
  ): Promise<GroupResDto> {
    const newGroup = await this._groupService.editGrouById({
      id,
      title,
      ownerId,
    });
    this._eventEmitter.emit(ServerGroupEvent.GROUP_UPDATE, newGroup);

    return plainToInstance(GroupResDto, newGroup);
  }

  // api/group/:id/owner
  @Patch(':id/owner')
  @ApiPatchOnwerGroupByIdDoc()
  async updateOwnerGroup(
    @AuthUser() { id: ownerId }: User,
    @Param('id') id: string,
    @Body() { newOwnerId }: GroupAddUserDto,
  ): Promise<GroupResDto> {
    const params = { ownerId, id, newOwnerId };

    const newGroup = await this._groupService.updateOwnerGroup(params);
    this._eventEmitter.emit(ServerGroupEvent.GROUP_OWNER_UPDATE, newGroup);

    return plainToInstance(GroupResDto, newGroup);
  }

  // api/groups/:id/leave
  @Delete('/:id/leave')
  @ApiUserLeaveGroupByIdDoc()
  async leaveGroupById(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ): Promise<GroupResDto> {
    const params = { id, userId };
    const group = await this._groupService.userLeaveGroup(params);
    this._eventEmitter.emit(ServerGroupEvent.GROUP_USER_LEAVE, {
      group,
      userId,
    });

    return plainToInstance(GroupResDto, group);
  }
}

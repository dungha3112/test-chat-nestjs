import { Group, User } from '../../utils/typeorm';
import {
  TCheckUserInGroupParams,
  TCreateGroupParams,
  TEditGroupParams,
  TUpdateLastMessageGroupParams,
  TUpdateOwnerGroupPrams,
  TUserLeaveGroup,
} from '../types/group.type';

export interface IGroupService {
  createGroup(params: TCreateGroupParams): Promise<Group>;
  getGroups(userId: string): Promise<Group[]>;

  findGroupById(id: string): Promise<Group>;

  isUserInGroup(params: TCheckUserInGroupParams): Promise<User>;

  updateLastMessageGroup(params: TUpdateLastMessageGroupParams);

  editGrouById(params: TEditGroupParams): Promise<Group>;

  updateOwnerGroup(params: TUpdateOwnerGroupPrams): Promise<Group>;

  userLeaveGroup(params: TUserLeaveGroup): Promise<Group>;

  saveGroup(group: Group): Promise<Group>;
}

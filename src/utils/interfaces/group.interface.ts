import { Group, User } from '../typeorm';
import {
  TCheckUserInGroupParams,
  TCreateGroupParams,
  TEditGroupParams,
  TUpdateLastMessageParams,
  TUpdateOwnerGroupPrams,
  TUserLeaveGroup,
} from '../types';

export interface IGroupService {
  createGroup(params: TCreateGroupParams): Promise<Group>;
  getGroups(userId: string): Promise<Group[]>;

  findGroupById(id: string): Promise<Group>;

  isUserInGroup(params: TCheckUserInGroupParams): Promise<User>;

  updateLastMessageGroup(params: TUpdateLastMessageParams);

  editGrouById(params: TEditGroupParams): Promise<Group>;

  updateOwnerGroup(params: TUpdateOwnerGroupPrams): Promise<Group>;

  userLeaveGroup(params: TUserLeaveGroup): Promise<Group>;

  saveGroup(group: Group): Promise<Group>;
}

import { Group } from '../typeorm';
import {
  TCheckUserInGroupParams,
  TCreateGroupParams,
  TUpdateLastMessageParams,
} from '../types';

export interface IGroupService {
  createGroup(params: TCreateGroupParams): Promise<Group>;
  getGroups(userId: string): Promise<Group[]>;

  findGroupById(id: string): Promise<Group>;

  isUserInGroup(params: TCheckUserInGroupParams): Promise<Group>;

  updateLastMessageGroup(params: TUpdateLastMessageParams);

  saveGroup(group: Group): Promise<Group>;
}

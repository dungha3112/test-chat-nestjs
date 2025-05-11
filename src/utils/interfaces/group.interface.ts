import { Group } from '../typeorm';
import { TCheckUserInGroupParams, TCreateGroupParams } from '../types';

export interface IGroupService {
  createGroup(params: TCreateGroupParams): Promise<Group>;
  getGroups(userId: string): Promise<Group[]>;

  findGroupById(id: string): Promise<Group>;

  isUserInGroup(params: TCheckUserInGroupParams): Promise<Group>;

  saveGroup(group: Group): Promise<Group>;
}

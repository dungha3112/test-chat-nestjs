import { Group } from '../typeorm';
import { TCreateGroupParams } from '../types/group.type';

export interface IGroupService {
  createGroup(params: TCreateGroupParams): Promise<Group>;
}

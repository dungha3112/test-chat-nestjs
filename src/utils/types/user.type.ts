import { Request } from 'express';
import { User } from '../typeorm';

type TFindUserParams = Partial<{
  id: string;
  username: string;
  email: string;
}>;

type TFindUserOptions = {
  selectAll: boolean;
};

export type TFindUserDetails = {
  params: TFindUserParams;
  options: TFindUserOptions;
};

//AuthenticatedRequest
export interface AuthenticatedRequest extends Request {
  user: User;
}

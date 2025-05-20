import { Request } from 'express';
import { User } from '../utils/typeorm';

type TFindUserParams = Partial<{
  id: string;
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

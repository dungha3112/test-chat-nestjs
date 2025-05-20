import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedRequest } from '../../user/user.type';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();
    delete request?.user?.password;
    return instanceToPlain(request.user);
  },
);

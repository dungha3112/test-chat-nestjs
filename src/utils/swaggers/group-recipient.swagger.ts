import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddUserToGroupResDto, RemoveUserToGroupResDto } from 'src/group/dtos';
import { GroupRecipientAddUserDto } from 'src/group/dtos/group-recipient.add.dto';
import { GroupRecipientRemoveUserDto } from 'src/group/dtos/group-recipient.remove.dto';

export function ApiOwnerAddUserToGroupDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Add new user to group' }),
    ApiBody({ type: GroupRecipientAddUserDto }),
    ApiResponse({
      status: 201,
      description: 'Add user to group successfully created.',
      type: AddUserToGroupResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

export function ApiOwnerRemoveUserToGroupDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove new user to group' }),
    ApiBody({ type: GroupRecipientRemoveUserDto }),
    ApiResponse({
      status: 201,
      description: 'Remove user to group successfully created.',
      type: RemoveUserToGroupResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

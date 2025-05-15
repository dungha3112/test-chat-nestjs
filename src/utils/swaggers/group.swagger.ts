import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GroupResDto } from 'src/group/dtos';
import { GroupAddUserDto } from 'src/group/dtos/groups/group-add-user.dto';
import { GroupCreateDto } from 'src/group/dtos/groups/group-create.dto';
import { GroupEditDto } from 'src/group/dtos/groups/group-edit.dto';

export function ApiGroupCreateDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new group' }),
    ApiBody({ type: GroupCreateDto }),
    ApiResponse({
      status: 201,
      description: 'The group successfully created.',
      type: GroupResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

export function ApiGroupsGetDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list group' }),
    ApiResponse({
      status: 201,
      description: 'Get list group successfully.',
      type: GroupResDto,
      isArray: true,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

export function ApiGetGroupByIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a group by id' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiResponse({
      status: 201,
      description: 'Get group successfully',
      type: GroupResDto,
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function ApiPatchGroupByIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Owner update group by id' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiResponse({
      status: 201,
      description: 'Update group successfully',
      type: GroupResDto,
    }),
    ApiBody({ type: GroupEditDto }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function ApiPatchOnwerGroupByIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Tranfer owner' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiResponse({
      status: 201,
      description: 'Tranfer owner successfully',
      type: GroupResDto,
    }),
    ApiBody({ type: GroupAddUserDto }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function ApiUserLeaveGroupByIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'User leave group' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiResponse({
      status: 201,
      description: 'User leave successfully',
      type: GroupResDto,
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

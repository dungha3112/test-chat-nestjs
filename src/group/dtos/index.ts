import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos';

export class MessageGroupResDto {
  @ApiProperty({ example: 'hehe' })
  content: string;

  @ApiProperty({ type: UserResponseDto })
  author: UserResponseDto;

  @ApiProperty({ example: '197b7874-c1f4-455c-bb20-80886ccf26c2' })
  id: string;

  @ApiProperty({ example: '2025-05-13T00:22:04.108Z' })
  createdAt: string;
}

export class GroupResDto {
  @ApiProperty({ example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d' })
  id: string;

  @ApiProperty({ example: '2025-05-12T20:19:35.582Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-13T00:22:06.012Z' })
  lastMessageSentAt: string;

  @ApiProperty({ type: MessageGroupResDto })
  lastMessageSent: MessageGroupResDto;

  @ApiProperty({ type: UserResponseDto })
  owner: UserResponseDto;

  @ApiProperty({ type: UserResponseDto, isArray: true })
  user: UserResponseDto[];
}

export class CreateNewMessageGroupDto {
  @ApiProperty({
    type: GroupResDto,
  })
  group: GroupResDto;

  @ApiProperty({
    type: MessageGroupResDto,
  })
  message: MessageGroupResDto;
}

export class GetMessagesGroupResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Total message',
  })
  total: number;
  @ApiProperty({
    type: Number,
    description: 'Current page',
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Current limit',
  })
  limit: number;

  @ApiProperty({
    type: Number,
    description: 'total pages',
  })
  totalPages: number;

  @ApiProperty({
    type: String,
    description: 'Conversation id',
  })
  conversationId: string;

  @ApiProperty({
    type: MessageGroupResDto,
    isArray: true,
  })
  messages: MessageGroupResDto[];
}

export class UpdateMessageGroupResDto {
  @ApiProperty({
    type: String,
    description: 'group id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  groupId: string;

  @ApiProperty({
    type: MessageGroupResDto,
  })
  message: MessageGroupResDto;
}

export class DeleteMessageGroupResDto {
  @ApiProperty({
    type: String,
    description: 'group id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  groupId: string;

  @ApiProperty({
    type: MessageGroupResDto,
  })
  message: MessageGroupResDto;
}

export class AddUserToGroupResDto {
  @ApiProperty({
    type: UserResponseDto,
  })
  recipient: UserResponseDto;

  @ApiProperty({
    type: GroupResDto,
  })
  group: GroupResDto;
}

export class RemoveUserToGroupResDto {
  @ApiProperty({
    type: UserResponseDto,
  })
  recipient: UserResponseDto;

  @ApiProperty({
    type: GroupResDto,
  })
  group: GroupResDto;
}

///////////////////////////////
// GROUP

import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos';

export * from './conversation-create.dto';
export * from './conversation-message.create.dto';
export * from './conversation-message-edit.dto';

export class MessageConverResDto {
  @ApiProperty({ example: 'string' })
  content: string;

  @ApiProperty({ type: UserResponseDto })
  author: UserResponseDto;

  @ApiProperty({ example: '197b7874-c1f4-455c-bb20-80886ccf26c2' })
  id: string;

  @ApiProperty({ example: '2025-05-13T00:22:04.108Z' })
  createdAt: Date;
}

export class ConverstionResDto {
  @ApiProperty({ example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d' })
  id: string;

  @ApiProperty({ example: '2025-05-12T20:19:35.582Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-13T00:22:06.012Z' })
  lastMessageSentAt: Date;

  @ApiProperty({ type: UserResponseDto })
  creator: UserResponseDto;

  @ApiProperty({ type: UserResponseDto })
  recipient: UserResponseDto;

  @ApiProperty({ type: MessageConverResDto })
  lastMessageSent: MessageConverResDto;
}

export class CreateConversationResponseDto {
  @ApiProperty({ type: MessageConverResDto })
  message: MessageConverResDto;

  @ApiProperty({ type: ConverstionResDto })
  conversation: ConverstionResDto;
}

export class GetMessagesConversationResponseDto {
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
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  conversationId: string;

  @ApiProperty({
    type: [MessageConverResDto],
    description: 'list messages',
  })
  messages: MessageConverResDto[];
}

export class UpdateMessageConverResponseDto {
  @ApiProperty({
    type: String,
    description: 'Conversation id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  conversationId: string;

  @ApiProperty({
    type: MessageConverResDto,
  })
  message: MessageConverResDto;
}

export class DeleteMessageConverResponseDto {
  @ApiProperty({
    type: String,
    description: 'Conversation id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  conversationId: string;

  @ApiProperty({
    type: MessageConverResDto,
  })
  message: MessageConverResDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/user/dtos';

export * from './conversations/conversation-create.dto';
export * from './messages/conversation-message.create.dto';
export * from './messages/conversation-message-edit.dto';

export class MessageConverResDto {
  @Expose()
  @ApiProperty({ example: 'string' })
  content: string;

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  author: UserResponseDto;

  @Expose()
  @ApiProperty({ example: '197b7874-c1f4-455c-bb20-80886ccf26c2' })
  id: string;

  @Expose()
  @ApiProperty({ example: '2025-05-13T00:22:04.108Z' })
  createdAt: string;
}

export class ConverstionResDto {
  @Expose()
  @ApiProperty({ example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d' })
  id: string;

  @Expose()
  @ApiProperty({ example: '2025-05-12T20:19:35.582Z' })
  createdAt: string;

  @Expose()
  @ApiProperty({ example: '2025-05-13T00:22:06.012Z' })
  lastMessageSentAt: string;

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  creator: UserResponseDto;

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  recipient: UserResponseDto;

  @Expose()
  @ApiProperty({ type: MessageConverResDto })
  lastMessageSent: MessageConverResDto;
}

export class CreateConversationResponseDto {
  @Expose()
  @ApiProperty({ type: MessageConverResDto })
  message: MessageConverResDto;

  @Expose()
  @ApiProperty({ type: ConverstionResDto })
  conversation: ConverstionResDto;
}

export class GetMessagesConversationResponseDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Total message',
  })
  total: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Current page',
  })
  page: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Current limit',
  })
  limit: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'total pages',
  })
  totalPages: number;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Conversation id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  conversationId: string;

  @Expose()
  @ApiProperty({
    type: [MessageConverResDto],
    description: 'list messages',
  })
  messages: MessageConverResDto[];
}

export class UpdateMessageConverResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Conversation id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  conversationId: string;

  @Expose()
  @ApiProperty({
    type: MessageConverResDto,
  })
  message: MessageConverResDto;
}

export class DeleteMessageConverResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Conversation id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  conversationId: string;

  @Expose()
  @ApiProperty({
    type: MessageConverResDto,
  })
  message: MessageConverResDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConversationCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: '8608735f-0c89-46c3-81e5-cd7df7ccb9fe' })
  recipientId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'hi' })
  message: string;
}

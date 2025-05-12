import { IsNotEmpty } from 'class-validator';

export class ConversationCreateDto {
  @IsNotEmpty()
  recipientId: string;

  @IsNotEmpty()
  message: string;
}

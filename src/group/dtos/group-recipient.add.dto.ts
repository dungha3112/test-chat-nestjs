import { IsNotEmpty, IsString } from 'class-validator';

export class GroupRecipientAddUserDto {
  @IsNotEmpty()
  @IsString()
  recipientId: string;
}

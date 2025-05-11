import { IsNotEmpty, IsString } from 'class-validator';

export class GroupRecipientRemoveUserDto {
  @IsNotEmpty()
  @IsString()
  recipientId: string;
}

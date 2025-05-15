import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GroupRecipientRemoveUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '8608735f-0c89-46c3-81e5-cd7df7ccb9fe' })
  recipientId: string;
}

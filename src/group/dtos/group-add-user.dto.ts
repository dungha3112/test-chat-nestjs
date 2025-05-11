import { IsNotEmpty, IsString } from 'class-validator';

export class GroupAddUserDto {
  @IsNotEmpty()
  @IsString()
  newOwnerId: string;
}

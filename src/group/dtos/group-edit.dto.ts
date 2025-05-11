import { IsNotEmpty, IsString } from 'class-validator';

export class GroupEditDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}

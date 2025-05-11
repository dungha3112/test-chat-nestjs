import { IsNotEmpty } from 'class-validator';

export class GroupMessageEditDto {
  @IsNotEmpty()
  content: string;
}

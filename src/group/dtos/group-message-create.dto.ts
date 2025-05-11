import { IsNotEmpty } from 'class-validator';

export class GroupMessageCreateDto {
  @IsNotEmpty()
  content: string;
}

import { IsNotEmpty } from 'class-validator';

export class ConverMessageCreateDto {
  @IsNotEmpty()
  content: string;
}

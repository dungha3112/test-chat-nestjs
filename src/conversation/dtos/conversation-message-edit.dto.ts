import { IsNotEmpty } from 'class-validator';

export class ConverMessageEditDto {
  @IsNotEmpty()
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConverMessageCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  content: string;
}

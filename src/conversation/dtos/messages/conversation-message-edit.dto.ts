import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConverMessageEditDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GroupMessageCreateDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'hi' })
  content: string;
}

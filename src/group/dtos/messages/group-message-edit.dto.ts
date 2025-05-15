import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GroupMessageEditDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'content edit' })
  content: string;
}

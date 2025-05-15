import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GroupEditDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'title group edit' })
  title: string;
}

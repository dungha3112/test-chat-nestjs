import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class GroupCreateDto {
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ApiProperty({
    example: [
      '624743d1-96e0-41fc-8434-a8e4b2918379',
      '4ce66319-215d-4042-b79b-89b7d928bd5b',
    ],
    isArray: true,
  })
  users: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'group' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'hi' })
  message: string;
}

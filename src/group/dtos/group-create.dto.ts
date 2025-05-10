import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class GroupCreateDto {
  @IsString({ each: true })
  @ArrayNotEmpty()
  users: string[];

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

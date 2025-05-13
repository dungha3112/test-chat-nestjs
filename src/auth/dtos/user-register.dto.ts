import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'user01' })
  username: string;
}

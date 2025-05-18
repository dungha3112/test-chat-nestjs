import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class ActiveAccountDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user01@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '559305' })
  @Length(6, 6, { message: 'OTP code consists of 6 characters' })
  otp: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user01@gmail.com' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user01@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '559305' })
  @Length(6, 6, { message: 'OTP code consists of 6 characters' })
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;
}

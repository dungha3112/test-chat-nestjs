import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActiveAccountDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user01@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'asvas-5ss+c4sc4s4-sdv4ds4v-sdvsdb1d-vdvd1dv-dvd4' })
  url: string;
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
  @ApiProperty({ example: 'asvas-5ss+c4sc4s4-sdv4ds4v-sdvsdb1d-vdvd1dv-dvd4' })
  url: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;
}

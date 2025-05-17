import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos';

export * from './user-login.dto';
export * from './user-register.dto';
export * from './refresh-token.dto';
export * from './active-account.dto';

export class UserLoginResponseDto {
  @ApiProperty({
    example: 'string',
  })
  accessToken: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'User details',
  })
  user: UserResponseDto;
}

export class UserRefreshTokenResponseDto {
  @ApiProperty({
    example: 'string',
  })
  accessToken: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'User details',
  })
  user: UserResponseDto;
}

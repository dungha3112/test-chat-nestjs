import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos';

export * from './user-login.dto';
export * from './user-register.dto';

export class UserLoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NjA4NzM1Zi0wYzg5LTQ2YzMtODFlNS1jZDdkZjdjY2I5ZmUiLCJqaXQiOiI0YzYyYjg0Ny0yZTlhLTQ5ODAtYTQ2NS1mNzVmMWEwZTRhNDUiLCJpYXQiOjE3NDcxMDMzMjIsImV4cCI6MTc0NzE4OTcyMn0.6Es9fZAmrlBy4yESujDzcDO-InwlNzTVzosVPeTgNQY',
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
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NjA4NzM1Zi0wYzg5LTQ2YzMtODFlNS1jZDdkZjdjY2I5ZmUiLCJqaXQiOiI0YzYyYjg0Ny0yZTlhLTQ5ODAtYTQ2NS1mNzVmMWEwZTRhNDUiLCJpYXQiOjE3NDcxMDMzMjIsImV4cCI6MTc0NzE4OTcyMn0.6Es9fZAmrlBy4yESujDzcDO-InwlNzTVzosVPeTgNQY',
  })
  accessToken: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'User details',
  })
  user: UserResponseDto;
}

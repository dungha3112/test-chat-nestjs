import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'c4sc4s4-sdv4ds4v-sdvsdb1d-vdvd1dv-dvd4' })
  refreshToken: string;
}

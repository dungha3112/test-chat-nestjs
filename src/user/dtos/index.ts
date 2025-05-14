// user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '624743d1-96e0-41fc-8434-a8e4b2918379' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'user01@gmail.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'user01' })
  username: string;

  @Expose()
  @ApiProperty({ example: '2025-05-12T18:22:00.186Z' })
  createdAt: Date;
}

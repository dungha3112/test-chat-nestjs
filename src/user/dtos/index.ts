// user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '624743d1-96e0-41fc-8434-a8e4b2918379' })
  id: string;

  @ApiProperty({ example: 'user01@gmail.com' })
  email: string;

  @ApiProperty({ example: 'user01' })
  username: string;

  @ApiProperty({ example: '2025-05-12T18:22:00.186Z' })
  createdAt: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/user/dtos';

export class FriendResDto {
  @Expose()
  @ApiProperty({ example: '197b7874-c1f4-455c-bb20-80886ccf26c2' })
  id: string;

  @Expose()
  @ApiProperty({ example: '2025-05-13T00:22:04.108Z' })
  createdAt: string;

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  sender: UserResponseDto;

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  receiver: UserResponseDto;
}

export class GetFriendsResDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Total message',
  })
  total: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Current page',
  })
  page: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Current limit',
  })
  limit: number;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'total pages',
  })
  totalPages: number;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'user id',
    example: 'a4acf1ab-2787-44d5-a03d-d28ef79eee1d',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    type: [FriendResDto],
    description: 'list friends',
  })
  friends: FriendResDto[];
}

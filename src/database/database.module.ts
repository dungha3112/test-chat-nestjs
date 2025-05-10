import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, User } from 'src/utils/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User, Group],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

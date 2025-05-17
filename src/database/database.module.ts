import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/utils/typeorm/entities';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: entities,
          synchronize: true,
          // synchronize: process.env.NODE_ENV !== 'production',
          // ssl: { rejectUnauthorized: true },
        };
      },
    }),
  ],
})
export class DatabaseModule {}

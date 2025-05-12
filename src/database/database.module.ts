import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Conversation,
  ConversationMessage,
  Group,
  GroupMessage,
  User,
} from 'src/utils/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [
          User,
          Group,
          GroupMessage,
          Conversation,
          ConversationMessage,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, ConversationMessage } from 'src/utils/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from 'src/utils/middlewares';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationMessage]),
    UserModule,
    CustomJwtModule,
  ],
  controllers: [ConversationController],
  providers: [
    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
  ],

  exports: [
    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
  ],
})
export class ConversationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('conversation');
  }
}

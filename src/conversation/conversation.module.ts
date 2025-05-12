import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, ConversationMessage } from 'src/utils/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from 'src/utils/middlewares';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';
import { ConversationMiddleware } from './middlewares/conversation.middleware';
import { ConversationMessageService } from './services/conversation-mesage.service';
import { ConversationMessageController } from './controllers/conversation-message.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationMessage]),
    UserModule,
    CustomJwtModule,
  ],
  controllers: [ConversationController, ConversationMessageController],
  providers: [
    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
    {
      provide: Services.CONVERSATION_MESSAGE,
      useClass: ConversationMessageService,
    },
  ],

  exports: [
    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
    {
      provide: Services.CONVERSATION_MESSAGE,
      useClass: ConversationMessageService,
    },
  ],
})
export class ConversationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('conversation');
    consumer.apply(ConversationMiddleware).forRoutes('conversation/:id');
  }
}

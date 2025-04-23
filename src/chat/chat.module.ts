import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession, Code, Message, User } from 'src/core/models';
import { JWTStrategy } from 'src/core/stratgies';
import { QaService, VectorStoreService } from 'src/core/utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ChatSession, Message, Code]),
  ],
  controllers: [ChatController],
  providers: [ChatService, JWTStrategy, QaService, VectorStoreService],
})
export class ChatModule {}

// src/chat/chat.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AskQuestionDecorator, GetChatMessagesDecorator, GetUserChatsDecorator, StartChatDecorator } from 'src/core/decorators/appliers';
import { GetUser } from 'src/core/decorators/auth';
import { QuestionDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @GetUserChatsDecorator()
  async getUserChats(@GetUser('id') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Post(':codeId')
  @StartChatDecorator()
  async startNewChat(@GetUser('id') userId: string, @Param('codeId') codeId: string) {
    return this.chatService.createChatSession(userId, codeId);
  }

  @Get(':chatId')
  @GetChatMessagesDecorator()
  async getChatMessages(@GetUser('id') userId: string, @Param('chatId') chatId: string) {
    return this.chatService.getChatMessages(userId, chatId);
  }

  @Post(':chatId/ask')
  @AskQuestionDecorator()
  async askQuestion(
    @Param('chatId') chatId: string,
    @Body() questionDto: QuestionDto,
    @GetUser('id') userId: string
  ) {
    return this.chatService.askQuestion(chatId, questionDto, userId);
  }
}
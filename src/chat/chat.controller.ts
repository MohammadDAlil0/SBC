// src/chat/chat.controller.ts
import { Controller, Post, Get, Param, Body, Delete, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AskQuestionDecorator, DeleteChatDecorator, GetChatMessagesDecorator, GetUserChatsDecorator, StartChatDecorator } from 'src/core/decorators/appliers';
import { GetUser } from 'src/core/decorators/auth';
import { QuestionDto } from './dto';
import { PaginationDto } from 'src/core/constants';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @GetUserChatsDecorator()
  async getUserChats(@GetUser('id') userId: string, @Query() filter: PaginationDto) {
    return this.chatService.getUserChats(userId, filter);
  }

  @Post(':codeId')
  @StartChatDecorator()
  async startNewChat(@GetUser('id') userId: string, @Param('codeId') codeId: string) {
    return this.chatService.createChatSession(userId, codeId);
  }

  @Get(':chatId')
  @GetChatMessagesDecorator()
  async getChatMessages(@GetUser('id') userId: string, @Param('chatId') chatId: string, @Query() filter: PaginationDto) {
    return this.chatService.getChatMessages(userId, chatId, filter);
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

  @Delete(':chatId')
  @DeleteChatDecorator()
  async deleteChat(@Param('chatId') chatId: string) {
    this.chatService.deleteChat(chatId);
  }
}
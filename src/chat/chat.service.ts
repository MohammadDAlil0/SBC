import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession, Code, Message, User } from 'src/core/models';
import { QaService } from 'src/core/utils';
import { Repository } from 'typeorm';
import { QuestionDto } from './dto';
import { PaginationDto } from 'src/core/constants';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly chatSession: Repository<ChatSession>,
    @InjectRepository(Code) private readonly code: Repository<Code>,
    @InjectRepository(Message) private readonly message: Repository<Message>,
    private readonly qaService: QaService,
    // private readonly config: ConfigService,
  ) {}

  async getUserChats(userId: string, filter: PaginationDto) {
    const { page = 1, limit = 10, ...rest } = filter;
    const offset = (page - 1) * limit;

    return this.chatSession.find({
      where: {
        user: { id: userId },
      },
      take: limit,
      skip: offset,
    });
  }

  async createChatSession(userId: string, codeId: string) {
    const chatCount = await this.chatSession.count({
      where: {
        user: { id: userId },
        code: { id: codeId },
      },
    });

    const code = await this.code.findOneOrFail({
      where: {
        id: codeId,
      },
    });

    const newSession = this.chatSession.create({
      name: `${code.name} ${chatCount + 1}`,
      user: { id: userId },
      code: { id: codeId },
    });
    return await this.chatSession.save(newSession);
  }

  async getChatMessages(userId: string, chatSessionId: string, filter: PaginationDto) {
    await this.chatSession.findOneOrFail({
      where: {
        id: chatSessionId,
        user: { id: userId },
      },
    });

    return this.message.find({
      where: { chatSession: { id: chatSessionId } },
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        content: true,
        fromUser: true,
        createdAt: true,
      },
    });
  }

  async askQuestion(
    chatSessionId: string,
    questionDto: QuestionDto,
    userId: string,
  ) {
    // 1. Verify chat session exists and belongs to user
    const chatSession = await this.chatSession.findOneOrFail({
      where: { id: chatSessionId, user: { id: userId } },
      relations: ['code'],
    }) as any;

    console.log('Print chatSession ****************************************');
    console.log(chatSession);
    const chatSessions = await this.chatSession.find({});
    const codes = await this.chatSession.find({});

    console.log('Start *****************************************');
    console.log(chatSessions);
    console.log('**********************************************');
    console.log(codes);
    console.log('*******************************************');


    // 2. Save user's question
    const userMessage = this.message.create({
      content: questionDto.content,
      fromUser: true,
      chatSession: { id: chatSessionId },
    });
    await this.message.save(userMessage);

    // 3. Get AI response (implement this in QaService)
    const { answer, sources } = await this.qaService.getAnswer(
      questionDto.content,
      chatSession.code.name,
    );

    // 4. Save AI response
    const aiMessage = this.message.create({
      content: answer,
      fromUser: false,
      chatSession: { id: chatSessionId },
    });
    await this.message.save(aiMessage);

    return {
      question: userMessage,
      answer: aiMessage,
      sources, // Include sources in response
    };
  }
  
  async deleteChat(chatId: string) {
    await this.chatSession.delete({
      id: chatId
    });
  }
}

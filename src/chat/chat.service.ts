import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession, Code, Message, User } from 'src/core/models';
import { Repository } from 'typeorm';
import { QuestionDto } from './dto';
import { PaginationDto } from 'src/core/constants';
import { QaService } from 'src/core/utils';

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

  async getChatMessages(
    userId: string,
    chatSessionId: string,
    filter: PaginationDto,
  ) {
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
    const chatSession = (await this.chatSession.findOneOrFail({
      where: { id: chatSessionId, user: { id: userId } },
      relations: ['code'],
    })) as any;

    // 2. Get last 4 messages (excluding current question)
    const previousMessages = await this.message.find({
      where: { chatSession: { id: chatSessionId } },
      order: { createdAt: 'DESC' },
      take: 4,
    });

    const formattedMessages = previousMessages
      .reverse()
      .map((ob) => `${ob.fromUser ? 'human' : 'assistant'}: ${ob.content}`)
      .join('\n')
      .trim();

    // 3. Save user's question
    const userMessage = this.message.create({
      content: questionDto.content,
      fromUser: true,
      chatSession: { id: chatSessionId },
    });
    await this.message.save(userMessage);

    // 4. Get AI response (implement this in QaService)
    const { answer, sources } = await this.qaService.getAnswer(
      questionDto.content,
      chatSession.code.collectionName,
      formattedMessages,
    );

    // 5. Save AI response
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
      id: chatId,
    });
  }

  private formatChatHistory(
    messages: Message[],
  ): Array<{ question: string; answer: string }> {
    const history: Array<{ question: string; answer: string }> = [];

    // Pair messages (user question followed by AI answer)
    for (let i = 0; i < messages.length; i += 2) {
      const userMsg = messages[i];
      const aiMsg = messages[i + 1];

      if (userMsg && aiMsg && userMsg.fromUser && !aiMsg.fromUser) {
        history.push({
          question: userMsg.content,
          answer: aiMsg.content,
        });
      }
    }

    return history;
  }
}

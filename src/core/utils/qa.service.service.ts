import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { VectorStoreService } from './vector-store.service';
import { ConfigService } from '@nestjs/config';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { BaseMessage } from '@langchain/core/messages';

@Injectable()
export class QaService {
  private llm: ChatOpenAI;
  private contextualizeQSystemPrompt: string;
  private systemPrompt2: string;

  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly configService: ConfigService,
  ) {
    // Initialize LLM with lower temperature for factual answers
    this.llm = new ChatOpenAI({
      modelName: this.configService.get('LLM_MODEL') || 'gpt-3.5-turbo',
      temperature: 0.5,
      openAIApiKey: this.configService.getOrThrow('OPENAI_API'),
    });

    this.contextualizeQSystemPrompt =
      'Given a chat history and the latest user question ' +
      'which might reference context in the chat history, ' +
      'formulate a standalone question which can be understood ' +
      'without the chat history. Do NOT answer the question, ' +
      'just reformulate it if needed and otherwise return it as is.';

      this.systemPrompt2 =
        "You are an assistant for question-answering tasks. " +
        "Use the following pieces of retrieved context to answer " +
        "the question. If you don't know the answer, say that you " +
        "don't know. Use three sentences maximum and keep the " +
        "answer concise." +
        "\n\n" +
        "{context}";
  }

  async getAnswer(
    question: string,
    codeName: string,
    chatHistory: BaseMessage[] = [],
  ) {
    try {
      const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
        ['system', this.contextualizeQSystemPrompt],
        new MessagesPlaceholder("chat_history"),
        ['human', '{input}'],
      ]);

      const vectorStore =
        await this.vectorStoreService.getVectorStore(codeName);

      const historyAwareRetriever = await createHistoryAwareRetriever({
        llm: this.llm,
        retriever: vectorStore.asRetriever(8),
        rephrasePrompt: contextualizeQPrompt,
      });
      
      const docs = await historyAwareRetriever.invoke({
        chat_history: chatHistory,
        input: question,
      });
      
      const qaPrompt2 = ChatPromptTemplate.fromMessages([
        ["system", this.systemPrompt2],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
      ]);

      const questionAnswerChain2 = await createStuffDocumentsChain({
        llm: this.llm,
        prompt: qaPrompt2,
      });

      const ragChain2 = await createRetrievalChain({
        retriever: historyAwareRetriever,
        combineDocsChain: questionAnswerChain2,
      });
      
      const finalAnswer = await ragChain2.invoke({
        chat_history: chatHistory,
        input: question,
      });
      return finalAnswer;
    
    } catch (error) {
      console.error('QaService Error:', error);
      return {
        answer: 'Apologies, I encountered an error. Please try again.',
        sources: [],
      };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { ConfigService } from '@nestjs/config';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class QaService {
  private llm: ChatOpenAI;
  private promptTemplate: string;
  private prompt: PromptTemplate;

  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly configService: ConfigService
  ) {
    // Initialize the LLM
    this.llm = new ChatOpenAI({
      modelName: this.configService.get('LLM_MODEL') || 'gpt-3.5-turbo',
      temperature: 0.7, // Slightly more creative answers
      openAIApiKey: this.configService.getOrThrow('OPENAI_API'),
    });

    // Define the prompt template
    this.promptTemplate = `You are an expert assistant helping with questions about code documentation.
Use the following code excerpts to answer the question at the end.
If you don't know the answer, say you don't know. Keep answers concise but informative.

Code Excerpts:
{context}

Question: {question}
Answer:`;

    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ['context', 'question'],
    });
  }

  async getAnswer(question: string, codeName: string) {
    try {
      // 1. Get the vector store
      const vectorStore = await this.vectorStoreService.getVectorStore(codeName);

      // 2. Create QA chain
      const qaChain = await this.getQaChain(vectorStore);

      // 3. Get answer
      const result = await this.answerQuestion(qaChain, question);


      // 4. Format response
      return {
        answer: result.answer,
        sources: result.sourceDocuments.map(doc => ({
          content: doc.pageContent,
          metadata: doc.metadata
        }))
      };

    } catch (error) {
      console.error('Error in QaService:', error);
      return {
        answer: "Sorry, I encountered an error processing your question.",
        sources: []
      };
    }
  }

  private async getQaChain(vectorStore: QdrantVectorStore) {
    return RetrievalQAChain.fromLLM(this.llm, vectorStore.asRetriever(8), {
      prompt: this.prompt,
      returnSourceDocuments: true,
    });
  }

  private async answerQuestion(chain: RetrievalQAChain, question: string) {
    const result = await chain.call({ query: question });
    return {
      answer: result.text,
      sourceDocuments: result.sourceDocuments,
    };
  }
}
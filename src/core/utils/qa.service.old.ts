// This file has been deprecated.

// import { Injectable } from '@nestjs/common';
// import { ChatOpenAI } from '@langchain/openai';
// import { RetrievalQAChain } from 'langchain/chains';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
// import { ConfigService } from '@nestjs/config';
// import { VectorStoreService } from './vector-store.service';

// @Injectable()
// export class QaService {
//   private llm: ChatOpenAI;
//   private prompt: PromptTemplate;

//   constructor(
//     private readonly vectorStoreService: VectorStoreService,
//     private readonly configService: ConfigService
//   ) {
//     // Initialize LLM with lower temperature for factual answers
//     this.llm = new ChatOpenAI({
//       modelName: this.configService.get('LLM_MODEL') || 'gpt-3.5-turbo',
//       temperature: 0.3,
//       openAIApiKey: this.configService.getOrThrow('OPENAI_API'),
//     });

//     // Enhanced prompt template incorporating system message and structure
//     this.prompt = new PromptTemplate({
//       template: `
// You are an expert assistant helping with questions about {bookName} Book. Follow these rules:
// 1. You will be provided by a set of docuemnts associated with the user's query.
// 2. You have to generate a response based on the documents provided.
// 3. Ignore the documents that are not relevant to the user's query.
// 4. You can applogize to the user if you are not able to generate a response.
// 5. You have to generate response in the same language as the user's query.
// 6. Be polite and respectful to the user.
// 7. Be precise and concise in your response. Avoid unnecessary information.

// Chat History:
// {chat_history}

// Context:
// {context}

// Question: {question}

// Based strictly on the context above, provide a focused answer:
// Answer:`.trim(),
//       inputVariables: ['bookName', 'context', 'question', 'chat_history'],
//     });
//   }

//   async getAnswer(question: string, codeName: string, bookName: string, chat_history: Array<{question: string, answer: string}>) {
//     try {
//       const vectorStore = await this.vectorStoreService.getVectorStore(codeName);

//       const retriever = vectorStore.asRetriever(8);
      
//       // Retrieve documents first to check emptiness
//       const docs = await retriever.getRelevantDocuments(question);
      
//       if (docs.length === 0) {
//         return {
//           answer: "I couldn't find relevant information. Please refine your question.",
//           sources: []
//         };
//       }

//       // Format documents with numbering and headers
//       const formattedContext = docs
//         .map((doc, i) => `## Document ${i+1}\n### Content:\n${doc.pageContent}`)
//         .join('\n\n');

//       // Create QA chain with formatted context
//       const qaChain = RetrievalQAChain.fromLLM(this.llm, retriever, {
//         prompt: this.prompt,
//         returnSourceDocuments: true,
//       });

//       // Get answer with formatted context
//       const result = await qaChain.call({
//         bookName: bookName,
//         query: question,
//         context: formattedContext,
//         chat_history: chat_history
//       });

//       return {
//         answer: result.text,
//         sources: result.sourceDocuments.map(doc => ({
//           content: doc.pageContent,
//           metadata: doc.metadata
//         }))
//       };

//     } catch (error) {
//       console.error('QaService Error:', error);
//       return {
//         answer: "Apologies, I encountered an error. Please try again.",
//         sources: []
//       };
//     }
//   }
// }